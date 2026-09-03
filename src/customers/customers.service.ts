import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CustomerStatus, Prisma, Role } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { MembershipsService } from '../memberships/memberships.service.js';
import {
  assignableUserFilter,
  customerScopeFilter,
} from '../common/scope/index.js';
import type { AuthUser } from '../common/types/index.js';
import {
  CreateCustomerDto,
  QueryCustomersDto,
  UpdateCustomerDto,
} from './dto/index.js';

/**
 * The relations that make a customer undeletable — Spec 6.3 forbids destroying
 * financial or usage history, and a cascade delete would take it with them.
 *
 * Declared once and used both by the delete guard and by the list payload, so
 * the button the UI offers and the answer the API gives cannot drift apart.
 */
const DELETE_BLOCKERS = {
  payments: true,
  refunds: true,
  bookings: true,
  entitlementLog: true,
  memberships: true,
} as const;

/**
 * Singular and plural wording for each blocker, so the refusal reads as a
 * sentence rather than as "1 payments, 2 entitlementLog".
 */
const BLOCKER_LABELS: Record<string, [string, string]> = {
  payments: ['payment', 'payments'],
  refunds: ['refund', 'refunds'],
  bookings: ['booking', 'bookings'],
  entitlementLog: ['entitlement ledger entry', 'entitlement ledger entries'],
  memberships: ['membership', 'memberships'],
};

/**
 * Marks a payment row the system wrote itself from an intake form's "Amount
 * paid", rather than one a user entered from the payment panel.
 */
const OPENING_PAYMENT_NOTE = 'Recorded when the customer was added';

/**
 * Just enough of a plan to name it in a "for plan" column on a payment or
 * refund row. Deliberately not the full package: the money rows only need the
 * label, and the membership table beside them carries the rest.
 */
const PLAN_REF = { select: { id: true, name: true } };

/** Owner summary returned alongside a customer on write responses. */
const EXEC_SUMMARY = {
  select: { id: true, name: true, email: true },
};

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private notifications: NotificationsService,
    private memberships: MembershipsService,
  ) {}

  private pending(amount: number, amountPaid: number): number {
    return Math.max(amount - amountPaid, 0);
  }

  /**
   * Resolves who the customer belongs to.
   *
   * An EXECUTIVE always owns what they create — they cannot hand a record to
   * anyone else. A MANAGER may assign within their own team or to themselves.
   * A SUPER_ADMIN may assign to any user, or leave it unassigned.
   */
  private async resolveAssignee(
    requested: string | null | undefined,
    currentUser: AuthUser,
    /**
     * Set only by the legacy import. See CustomersService.create.
     */
    legacyImport = false,
  ): Promise<string | null> {
    if (currentUser.role === Role.EXECUTIVE) {
      return currentUser.sub;
    }

    if (!requested) {
      return null;
    }

    const assignee = await this.prisma.user.findFirst({
      where: { AND: [{ id: requested }, assignableUserFilter(currentUser)] },
      select: { id: true, isActive: true },
    });

    if (!assignee) {
      throw new BadRequestException(
        'Assigned user not found or not in your team',
      );
    }
    /*
     * Two correct rules that disagree, resolved by which of them is being done.
     *
     * For new business, refusing a deactivated assignee is right — nobody
     * should be handed work after they have left.
     *
     * For the legacy sheet it is wrong. Roughly half its 822 sales were made by
     * staff who have since gone, and the client's instruction was to create
     * those people as inactive accounts precisely so their history stays
     * attributed to them. Refusing here would leave 400-odd customers with no
     * owner and hide them from every Manager.
     */
    if (!assignee.isActive && !legacyImport) {
      throw new BadRequestException(
        'Cannot assign a customer to a deactivated user',
      );
    }
    return assignee.id;
  }

  /** Loads a customer already narrowed to the caller's scope, or throws 404. */
  private async findScopedOrFail(id: string, currentUser: AuthUser) {
    const customer = await this.prisma.customer.findFirst({
      where: { AND: [{ id }, customerScopeFilter(currentUser)] },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async create(
    dto: CreateCustomerDto,
    currentUser: AuthUser,
    /**
     * Set only by the legacy Excel import, and it relaxes exactly two checks —
     * both because the sheet is two years of history rather than new business:
     *
     *   duplicates      the sheet has two members sharing a phone number and 21
     *                   repeated MAF numbers. The client asked for it to come in
     *                   as it stands and be corrected in the CRM.
     *   inactive owner  about half its sales were made by staff who have since
     *                   left, created here as inactive accounts so their history
     *                   stays theirs.
     *
     * Deliberately a parameter rather than a second create() method: the import
     * has to go through the same path as the form, or it would quietly skip the
     * opening payment row, the membership, the annual allocation, the ADA charge
     * and the status mirror — every invariant this service exists to keep.
     */
    options: { legacyImport?: boolean } = {},
  ) {
    /*
     * findFirst, not findUnique: phone and membershipId are no longer unique in
     * the database, for the reason above.
     *
     * The check stays here for manual entry. Dropping the database constraint
     * was about letting the import through — a human typing a duplicate into
     * the form is still almost always a mistake.
     */
    const existing = options.legacyImport
      ? null
      : await this.prisma.customer.findFirst({
          where: { phone: dto.phone },
          select: { id: true },
        });
    if (existing) {
      throw new ConflictException(
        'A customer with this phone number already exists',
      );
    }

    if (dto.membershipId && !options.legacyImport) {
      const membershipTaken = await this.prisma.customer.findFirst({
        where: { membershipId: dto.membershipId },
        select: { id: true },
      });
      if (membershipTaken) {
        throw new ConflictException(
          'A customer with this membership ID already exists',
        );
      }
    }

    const assignedExecId = await this.resolveAssignee(
      dto.assignedExecId,
      currentUser,
      options.legacyImport,
    );

    /*
     * Validate the plan before the transaction opens, so a bad packageId is a
     * clean 400 rather than a rollback halfway through creating a customer.
     */
    let plan: { id: string; name: string } | null = null;
    if (dto.packageId) {
      const pkg = await this.prisma.package.findUnique({
        where: { id: dto.packageId },
        select: { id: true, name: true, isActive: true },
      });
      if (!pkg) {
        throw new BadRequestException('Plan not found');
      }
      if (!pkg.isActive) {
        throw new BadRequestException(
          `"${pkg.name}" is inactive and cannot be sold. Activate it under Plans first.`,
        );
      }
      plan = pkg;
    }

    const amount = dto.amount ?? 0;
    const amountPaid = dto.amountPaid ?? 0;

    // Spec 8.1 — customer creation is a transaction. Membership, entitlement
    // allocation and the initial payment join this block in phases 4-6.
    const customer = await this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: {
          name: dto.name,
          phone: dto.phone,
          // Both numbers, per the client: a member commonly has a main and an
          // alternative, and the sheet packs them into one cell.
          altPhone: dto.altPhone || null,
          email: dto.email,
          coApplicant: dto.coApplicant || null,
          location: dto.location || null,
          plan: dto.plan,
          amount,
          amountPaid,
          pendingAmount: this.pending(amount, amountPaid),
          validity: dto.validity,
          totalDays: dto.totalDays || 0,
          totalNights: dto.totalNights || 0,
          assignedExecId,
          membershipId: dto.membershipId || null,
        },
        include: { assignedExec: EXEC_SUMMARY },
      });

      /*
       * The "Amount paid" on the intake form is not a fact separate from the
       * payment history — it IS the first payment. Storing only the aggregate
       * was a double-counting bug: recording that same money again from the
       * payment panel pushed `amountPaid` to twice the real figure while the
       * history still showed a single row. Writing the row here keeps §9.1's
       * rule true (the aggregate always equals SUM of payment rows), so the
       * two can never disagree, and the money is auditable from day one.
       */
      if (amountPaid > 0) {
        const openingPayment = await tx.payment.create({
          data: {
            customerId: customer.id,
            amount: amountPaid,
            method: dto.paymentMethod || null,
            notes: OPENING_PAYMENT_NOTE,
          },
        });

        await this.audit.withinTransaction(tx, {
          actorId: currentUser.sub,
          action: 'CREATE',
          entity: 'Payment',
          entityId: openingPayment.id,
          metadata: {
            customerId: customer.id,
            amount: amountPaid,
            method: openingPayment.method,
            source: 'customer-create',
          },
        });
      }

      /*
       * Spec 8.1: the plan purchase, its entitlement allocation and the opening
       * payment all belong to the same transaction as the customer. Recorded
       * after the payment on purpose — recordSaleWithinTransaction attributes
       * any unattached payment to the new membership, which is what fills the
       * "for plan" column on the money taken at intake.
       */
      if (plan) {
        // Dates are left to MembershipsService, which owns the month-end clamp.
        await this.memberships.recordSaleWithinTransaction(tx, {
          customerId: customer.id,
          packageId: plan.id,
          // Back-dated for an imported row; today for one typed in.
          startDate: dto.saleDate,
          /*
           * The negotiated figure, not the catalogue's. The same plan went out
           * anywhere between 10,000 and 70,000 in the legacy sheet, so the
           * price belongs to the sale rather than to the plan.
           */
          salePrice: amount || null,
          offersText: dto.offersText || null,
          remarksText: dto.remarksText || null,
          usageNotes: dto.usageNotes || null,
          adaAmount: dto.adaAmount ?? null,
          complimentaryNights: dto.complimentaryNights ?? null,
          actorId: currentUser.sub,
        });
      }

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'CREATE',
        entity: 'Customer',
        entityId: customer.id,
        metadata: {
          name: customer.name,
          phone: customer.phone,
          plan: customer.plan,
          amount: customer.amount,
          amountPaid: customer.amountPaid,
          assignedExecId: customer.assignedExecId,
          membershipId: customer.membershipId,
          packageId: plan?.id ?? null,
          coApplicant: customer.coApplicant,
          location: customer.location,
          altPhone: customer.altPhone,
        },
      });

      return customer;
    });

    /*
     * Spec 14 — email the new customer their membership details.
     *
     * Deliberately AFTER the transaction commits and deliberately awaited but
     * never allowed to throw: the customer is already saved, so a mail failure
     * must not roll it back or surface as a failed create. Sending is off until
     * the client confirms the template (Spec 22 #7).
     */
    if (customer.email) {
      this.notifications
        .notifyNewCustomer({
          customerName: customer.name,
          customerEmail: customer.email,
          plan: customer.plan,
          amount: customer.amount,
          amountPaid: customer.amountPaid,
          pendingAmount: customer.pendingAmount,
          validity: customer.validity,
          totalDays: customer.totalDays,
          totalNights: customer.totalNights,
          membershipId: customer.membershipId,
        })
        // The .catch is load-bearing, not defensive noise: a bare `void` on a
        // rejecting promise is an unhandled rejection, which terminates the
        // Node process. The service must not depend on the notifier never
        // throwing.
        .catch((error: unknown) => {
          this.logger.error(
            `Customer ${customer.id} was created but the welcome email failed`,
            error instanceof Error ? error.stack : String(error),
          );
        });
    }

    return customer;
  }

  /**
   * Turns a query into Prisma filters.
   *
   * Shared by the list and the summary counters so the two cannot disagree —
   * the counters used to ignore the filters entirely, which meant selecting one
   * Executive showed their 198 customers in the table above a headline of 835.
   *
   * `includeStatus` exists because the status counters are a breakdown BY
   * status. Applying the status filter to them would collapse the breakdown:
   * click "Cancelled" and Total would read 3 as well, leaving no way to switch
   * back. So they honour every filter except their own dimension.
   */
  private buildFilters(
    query: QueryCustomersDto,
    currentUser: AuthUser,
    { includeStatus = true }: { includeStatus?: boolean } = {},
  ): Prisma.CustomerWhereInput[] {
    const { search, status, plan, assignedExecId, assignedManagerId } = query;

    // The caller's scope is always the first filter; every other filter can
    // only narrow it further, never widen it.
    const filters: Prisma.CustomerWhereInput[] = [
      customerScopeFilter(currentUser),
    ];

    if (status && includeStatus) {
      filters.push({ status: status as Prisma.EnumCustomerStatusFilter });
    }
    if (plan) {
      filters.push({ plan });
    }
    if (assignedExecId) {
      filters.push({ assignedExecId });
    }
    if (assignedManagerId) {
      filters.push({ assignedExec: { managerId: assignedManagerId } });
    }
    if (search) {
      filters.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { email: { contains: search, mode: 'insensitive' } },
          { membershipId: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    return filters;
  }

  async findAll(query: QueryCustomersDto, currentUser: AuthUser) {
    const { page = 1, limit = 20 } = query;

    const filters = this.buildFilters(query, currentUser);
    const where: Prisma.CustomerWhereInput = { AND: filters };

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedExec: {
            select: {
              id: true,
              name: true,
              manager: { select: { id: true, name: true } },
            },
          },
          // Lets the list show a delete control only where deleting is actually
          // possible, instead of offering one that always 409s.
          _count: { select: DELETE_BLOCKERS },
          /*
           * The opening payment only, so the edit form can show how the money
           * was taken and correct it. Just one row on purpose: where a customer
           * has several payments a single "paid by" dropdown cannot say which
           * one it means, and the form defers to the payment history instead.
           * _count.payments above says how many there really are.
           */
          payments: {
            select: { id: true, method: true },
            orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
            take: 1,
          },
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  async findOne(id: string, currentUser: AuthUser) {
    const customer = await this.prisma.customer.findFirst({
      where: { AND: [{ id }, customerScopeFilter(currentUser)] },
      include: {
        assignedExec: {
          select: {
            id: true,
            name: true,
            email: true,
            manager: { select: { id: true, name: true, email: true } },
          },
        },
        // The nested membership is what fills the "for plan" column. Without
        // it the id was fetched but the plan name was not, so a payment that
        // *is* attributed to a plan still rendered as unattributed.
        payments: {
          orderBy: { date: 'desc' },
          take: 10,
          include: { membership: { select: { package: PLAN_REF } } },
        },
        bookings: { orderBy: { createdAt: 'desc' }, take: 10 },
        refunds: {
          orderBy: { date: 'desc' },
          take: 10,
          include: {
            membership: { select: { package: PLAN_REF } },
            approvedBy: { select: { id: true, name: true } },
          },
        },
        memberships: {
          orderBy: { createdAt: 'desc' },
          // days/nights included because the detail page prints them per
          // membership — selecting only id+name rendered "undefined /
          // undefined" in the plan-purchases table.
          include: {
            package: {
              select: {
                id: true,
                name: true,
                days: true,
                nights: true,
                price: true,
                validityMonths: true,
              },
            },
          },
        },
        _count: {
          select: {
            payments: true,
            bookings: true,
            refunds: true,
            memberships: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto, currentUser: AuthUser) {
    const customer = await this.findScopedOrFail(id, currentUser);

    if (dto.phone && dto.phone !== customer.phone) {
      const phoneTaken = await this.prisma.customer.findFirst({
        where: { phone: dto.phone },
        select: { id: true },
      });
      if (phoneTaken) {
        throw new ConflictException(
          'A customer with this phone number already exists',
        );
      }
    }

    if (dto.membershipId && dto.membershipId !== customer.membershipId) {
      const membershipTaken = await this.prisma.customer.findFirst({
        where: { membershipId: dto.membershipId },
        select: { id: true },
      });
      if (membershipTaken) {
        throw new ConflictException(
          'A customer with this membership ID already exists',
        );
      }
    }

    /*
     * `amountPaid` is a cached aggregate of the payment rows (§9.1), not an
     * independent number. Letting it be typed over once rows exist is what
     * desynchronised the two. Corrections now go through the payment history,
     * which is auditable and reversible; the field itself stays editable only
     * while there is no row to contradict — and in that case the write below
     * creates the missing row rather than leaving the aggregate dangling.
     */
    const paidChanges =
      dto.amountPaid !== undefined && dto.amountPaid !== customer.amountPaid;
    const recordedPayments = paidChanges
      ? await this.prisma.payment.count({ where: { customerId: id } })
      : 0;

    if (paidChanges && recordedPayments > 0) {
      throw new ConflictException(
        'Amount paid is the total of the payment records on this customer, so it cannot be typed over. Add or remove a payment in the payment history instead.',
      );
    }

    /*
     * status mirrors the customer's memberships (Spec 11 calls it "Membership
     * status"), and MembershipsService keeps it in step. Accepting a hand-typed
     * value once memberships exist is what would let the list disagree with the
     * customer's own page again -- the bug this mirror was introduced to fix.
     *
     * Before any plan is recorded there is nothing to derive from, so the field
     * stays editable and the staff's value (typically PENDING) stands.
     */
    if (dto.status !== undefined && dto.status !== customer.status) {
      const membershipCount = await this.prisma.membership.count({
        where: { customerId: id },
      });
      if (membershipCount > 0) {
        throw new ConflictException(
          'Status follows the memberships on this customer and cannot be set directly. Cancel, expire or reactivate the membership instead.',
        );
      }
    }

    const data: Prisma.CustomerUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.altPhone !== undefined) data.altPhone = dto.altPhone || null;
    if (dto.coApplicant !== undefined) {
      data.coApplicant = dto.coApplicant || null;
    }
    if (dto.location !== undefined) data.location = dto.location || null;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.plan !== undefined) data.plan = dto.plan;
    if (dto.amount !== undefined) data.amount = dto.amount;
    if (dto.amountPaid !== undefined) data.amountPaid = dto.amountPaid;
    if (dto.validity !== undefined) data.validity = dto.validity;
    if (dto.totalDays !== undefined) data.totalDays = dto.totalDays;
    if (dto.totalNights !== undefined) data.totalNights = dto.totalNights;
    if (dto.membershipId !== undefined) {
      data.membershipId = dto.membershipId || null;
    }
    if (dto.status !== undefined) {
      data.status = dto.status as Prisma.CustomerUpdateInput['status'];
    }

    // Recalculate the pending amount whenever either side of it moves.
    if (dto.amount !== undefined || dto.amountPaid !== undefined) {
      data.pendingAmount = this.pending(
        dto.amount ?? customer.amount,
        dto.amountPaid ?? customer.amountPaid,
      );
    }

    // Reassignment is scoped: an Executive can never move a record off itself.
    if (dto.assignedExecId !== undefined) {
      if (currentUser.role === Role.EXECUTIVE) {
        if (dto.assignedExecId && dto.assignedExecId !== currentUser.sub) {
          throw new BadRequestException(
            'You cannot reassign a customer to another user',
          );
        }
      } else {
        const assignee = await this.resolveAssignee(
          dto.assignedExecId,
          currentUser,
        );
        data.assignedExec = assignee
          ? { connect: { id: assignee } }
          : { disconnect: true };
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.customer.update({
        where: { id },
        data,
        include: { assignedExec: EXEC_SUMMARY },
      });

      // Back-fill the row for an opening balance set on a customer that had
      // none, so `amountPaid === SUM(payments)` holds after this write too.
      if (paidChanges && dto.amountPaid && dto.amountPaid > 0) {
        /*
         * Attribute it to the plan, on the same rule PaymentsService uses: a
         * customer holds at most one ACTIVE membership, so with exactly one the
         * attribution is unambiguous. Without this the row landed with a blank
         * "for plan" while the identical payment recorded from the payments
         * panel was attributed — the same money answering two different ways
         * depending on which screen entered it.
         */
        const active = await tx.membership.findMany({
          where: { customerId: id, status: 'ACTIVE' },
          select: { id: true },
          take: 2,
        });
        const membershipId = active.length === 1 ? active[0].id : null;

        const openingPayment = await tx.payment.create({
          data: {
            customerId: id,
            membershipId,
            amount: dto.amountPaid,
            method: dto.paymentMethod || null,
            notes: OPENING_PAYMENT_NOTE,
          },
        });

        await this.audit.withinTransaction(tx, {
          actorId: currentUser.sub,
          action: 'CREATE',
          entity: 'Payment',
          entityId: openingPayment.id,
          metadata: {
            customerId: id,
            amount: dto.amountPaid,
            membershipId,
            source: 'customer-update',
          },
        });
      }

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'UPDATE',
        entity: 'Customer',
        entityId: id,
        metadata: {
          before: {
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            plan: customer.plan,
            amount: customer.amount,
            amountPaid: customer.amountPaid,
            pendingAmount: customer.pendingAmount,
            status: customer.status,
            assignedExecId: customer.assignedExecId,
            membershipId: customer.membershipId,
          },
          after: {
            name: updated.name,
            phone: updated.phone,
            email: updated.email,
            plan: updated.plan,
            amount: updated.amount,
            amountPaid: updated.amountPaid,
            pendingAmount: updated.pendingAmount,
            status: updated.status,
            assignedExecId: updated.assignedExecId,
            membershipId: updated.membershipId,
          },
        },
      });

      return updated;
    });
  }

  async remove(id: string, currentUser: AuthUser) {
    /*
     * Spec 6.3 — financial and ledger history is immutable, so a customer that
     * owns any is never deletable. Cancel the membership instead.
     *
     * The counts come from the same _count the list uses, which is both one
     * query instead of six and a guarantee that the UI's decision to show a
     * delete control matches the answer this method would give.
     */
    const customer = await this.prisma.customer.findFirst({
      where: { AND: [{ id }, customerScopeFilter(currentUser)] },
      include: { _count: { select: DELETE_BLOCKERS } },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const blockers = customer._count;
    const total = Object.values(blockers).reduce((a, b) => a + b, 0);

    if (total > 0) {
      const detail = Object.entries(blockers)
        .filter(([, count]) => count > 0)
        .map(([kind, count]) => {
          const [one, many] = BLOCKER_LABELS[kind] ?? [kind, kind];
          return `${count} ${count === 1 ? one : many}`;
        })
        .join(', ');

      /*
       * The advice has to match what the API will actually accept. It used to
       * say "set the status to CANCELLED instead", which stopped being possible
       * once status became a mirror of the memberships — following it would earn
       * a second 409. And a customer who is already cancelled has nothing left
       * to do, so telling them to cancel again is worse than saying nothing.
       */
      const advice =
        customer.status === CustomerStatus.CANCELLED
          ? 'This customer is already cancelled. They stay on record so the history above remains auditable.'
          : 'Cancel or expire their membership instead — that marks the customer CANCELLED while keeping the history.';

      throw new ConflictException(
        `${customer.name} cannot be deleted: ${detail} on record. ${advice}`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.customer.delete({ where: { id } });

      await this.audit.withinTransaction(tx, {
        actorId: currentUser.sub,
        action: 'DELETE',
        entity: 'Customer',
        entityId: id,
        metadata: {
          name: customer.name,
          phone: customer.phone,
          plan: customer.plan,
          amount: customer.amount,
          assignedExecId: customer.assignedExecId,
        },
      });
    });

    return { message: 'Customer deleted successfully' };
  }

  /** Dashboard counters, scoped exactly like the list endpoint (Spec 12). */
  /**
   * The summary tiles above the customer list, narrowed by the same filters the
   * list is showing.
   *
   * Before this took a query the counters were always global: picking one
   * Executive filtered the table to their 198 customers while the headline
   * still read 835, and the money tiles totalled the whole business. A summary
   * that does not describe the rows beneath it is worse than no summary.
   *
   * Two different filter sets, deliberately:
   *
   *   status counters  every filter EXCEPT status. They are a breakdown BY
   *                    status and double as the switcher between them, so
   *                    applying the status filter would collapse them — click
   *                    "Cancelled" and Total would read 3 too.
   *   money tiles      every filter INCLUDING status, because they describe the
   *                    rows actually on screen.
   */
  async getStats(query: QueryCustomersDto, currentUser: AuthUser) {
    const facetFilters = this.buildFilters(query, currentUser, {
      includeStatus: false,
    });
    const shownFilters = this.buildFilters(query, currentUser);

    const countBy = (extra?: Prisma.CustomerWhereInput) =>
      this.prisma.customer.count({
        where: { AND: extra ? [...facetFilters, extra] : facetFilters },
      });

    const [total, active, pending, cancelled, expired, aggregates] =
      await Promise.all([
        countBy(),
        countBy({ status: 'ACTIVE' }),
        countBy({ status: 'PENDING' }),
        countBy({ status: 'CANCELLED' }),
        countBy({ status: 'EXPIRED' }),
        this.prisma.customer.aggregate({
          where: { AND: shownFilters },
          _sum: { amount: true, amountPaid: true, pendingAmount: true },
        }),
      ]);

    return {
      total,
      active,
      pending,
      cancelled,
      expired,
      totalSales: aggregates._sum.amount ?? 0,
      totalPaid: aggregates._sum.amountPaid ?? 0,
      totalPending: aggregates._sum.pendingAmount ?? 0,
      /*
       * Says what the figures cover, so the UI can label them rather than
       * leaving the reader to guess whether 198 is everyone or one person.
       */
      scopedBy: {
        status: query.status ?? null,
        plan: query.plan ?? null,
        assignedExecId: query.assignedExecId ?? null,
        assignedManagerId: query.assignedManagerId ?? null,
        search: query.search ?? null,
      },
    };
  }

  /**
   * Users this caller may assign a customer to, for the form's owner picker.
   * Reuses the same filter as the write path so the UI cannot offer a target
   * the API would then reject.
   */
  async findAssignableUsers(currentUser: AuthUser) {
    return this.prisma.user.findMany({
      where: {
        AND: [
          { isActive: true },
          assignableUserFilter(currentUser),
          currentUser.role === Role.SUPER_ADMIN
            ? { role: { in: [Role.EXECUTIVE, Role.MANAGER] } }
            : {},
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        manager: { select: { id: true, name: true } },
      },
      orderBy: [{ role: 'asc' }, { name: 'asc' }],
    });
  }
}
