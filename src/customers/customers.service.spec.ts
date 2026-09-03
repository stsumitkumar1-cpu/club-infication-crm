// Nest 12 is ESM, so the runner runs in ESM mode where `jest` is not a global.
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CustomersService } from './customers.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { MembershipsService } from '../memberships/memberships.service.js';
import type { AuthUser } from '../common/types/index.js';

/** Bare `Mock` defaults to an unknown signature, which rejects mock payloads. */
type AnyMock = Mock<(...args: any[]) => any>;
const mockFn = (): AnyMock => jest.fn<(...args: any[]) => any>();

const SUPER_ADMIN: AuthUser = {
  sub: 'admin-1',
  email: 'admin@clubinfication.com',
  name: 'Super Admin',
  role: Role.SUPER_ADMIN,
};
const MANAGER_1: AuthUser = {
  sub: 'manager-1',
  email: 'm1@clubinfication.com',
  name: 'Manager One',
  role: Role.MANAGER,
};
const EXECUTIVE_A: AuthUser = {
  sub: 'exec-a',
  email: 'a@clubinfication.com',
  name: 'Exec A',
  role: Role.EXECUTIVE,
};

describe('CustomersService (scope + ownership)', () => {
  let service: CustomersService;
  let prisma: {
    customer: {
      findMany: AnyMock;
      findFirst: AnyMock;
      findUnique: AnyMock;
      count: AnyMock;
      aggregate: AnyMock;
      create: AnyMock;
      update: AnyMock;
      delete: AnyMock;
    };
    user: { findFirst: AnyMock; findMany: AnyMock };
    payment: { count: AnyMock; create: AnyMock };
    refund: { count: AnyMock };
    booking: { count: AnyMock };
    entitlementLedger: { count: AnyMock };
    membership: { count: AnyMock; findMany: AnyMock };
    package: { findUnique: AnyMock };
    $transaction: AnyMock;
  };
  let notifications: { notifyNewCustomer: AnyMock };
  let memberships: { recordSaleWithinTransaction: AnyMock };

  beforeEach(async () => {
    prisma = {
      customer: {
        findMany: mockFn().mockResolvedValue([]),
        findFirst: mockFn(),
        findUnique: mockFn().mockResolvedValue(null),
        count: mockFn().mockResolvedValue(0),
        aggregate: mockFn().mockResolvedValue({ _sum: {} }),
        create: mockFn().mockResolvedValue({ id: 'cust-new' }),
        update: mockFn().mockResolvedValue({ id: 'cust-1' }),
        delete: mockFn().mockResolvedValue({ id: 'cust-1' }),
      },
      user: { findFirst: mockFn(), findMany: mockFn().mockResolvedValue([]) },
      payment: {
        count: mockFn().mockResolvedValue(0),
        create: mockFn().mockResolvedValue({ id: 'pay-new', method: null }),
      },
      refund: { count: mockFn().mockResolvedValue(0) },
      booking: { count: mockFn().mockResolvedValue(0) },
      entitlementLedger: { count: mockFn().mockResolvedValue(0) },
      membership: {
        count: mockFn().mockResolvedValue(0),
        findMany: mockFn().mockResolvedValue([]),
      },
      package: { findUnique: mockFn().mockResolvedValue(null) },
      $transaction: mockFn().mockImplementation((cb: any) => cb(prisma)),
    };

    notifications = { notifyNewCustomer: mockFn().mockResolvedValue({ sent: false }) };
    memberships = { recordSaleWithinTransaction: mockFn().mockResolvedValue({ id: 'ms-new' }) };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditService, useValue: { withinTransaction: mockFn() } },
        { provide: NotificationsService, useValue: notifications },
        { provide: MembershipsService, useValue: memberships },
      ],
    }).compile();

    service = moduleRef.get(CustomersService);
  });

  const scopeOf = (mock: AnyMock) => mock.mock.calls[0][0].where.AND[0];

  describe('list scope (Spec 2.3)', () => {
    it('applies no restriction for a Super Admin', async () => {
      await service.findAll({}, SUPER_ADMIN);
      expect(scopeOf(prisma.customer.findMany)).toEqual({});
    });

    it("limits a Manager to their team's customers", async () => {
      await service.findAll({}, MANAGER_1);
      expect(scopeOf(prisma.customer.findMany)).toEqual({
        OR: [
          { assignedExec: { managerId: MANAGER_1.sub } },
          { assignedExecId: MANAGER_1.sub },
        ],
      });
    });

    it('limits an Executive to their own customers', async () => {
      await service.findAll({}, EXECUTIVE_A);
      expect(scopeOf(prisma.customer.findMany)).toEqual({
        assignedExecId: EXECUTIVE_A.sub,
      });
    });

    it('never lets a filter widen the caller scope', async () => {
      // Executive A asks for Executive B's customers explicitly.
      await service.findAll({ assignedExecId: 'exec-b' }, EXECUTIVE_A);
      const { AND } = prisma.customer.findMany.mock.calls[0][0].where;
      expect(AND[0]).toEqual({ assignedExecId: EXECUTIVE_A.sub });
      expect(AND).toContainEqual({ assignedExecId: 'exec-b' });
      // Both are AND-ed, so the result set is empty rather than leaked.
    });
  });

  describe('findOne (IDOR — Spec 18)', () => {
    it('DENIES Executive A reading Executive B customer as 404', async () => {
      prisma.customer.findFirst.mockResolvedValue(null);
      await expect(service.findOne('cust-b', EXECUTIVE_A)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("DENIES Manager 1 reading Manager 2's customer as 404", async () => {
      prisma.customer.findFirst.mockResolvedValue(null);
      await expect(service.findOne('cust-m2', MANAGER_1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ALLOWS a Manager reading their own team customer', async () => {
      prisma.customer.findFirst.mockResolvedValue({ id: 'cust-1' });
      await expect(service.findOne('cust-1', MANAGER_1)).resolves.toEqual({
        id: 'cust-1',
      });
    });

    it('ALLOWS a Super Admin reading any customer', async () => {
      prisma.customer.findFirst.mockResolvedValue({ id: 'cust-any' });
      await expect(service.findOne('cust-any', SUPER_ADMIN)).resolves.toEqual({
        id: 'cust-any',
      });
    });

    it('folds scope into the query, not a post-fetch check', async () => {
      prisma.customer.findFirst.mockResolvedValue({ id: 'cust-1' });
      await service.findOne('cust-1', EXECUTIVE_A);
      expect(prisma.customer.findFirst.mock.calls[0][0].where.AND).toEqual([
        { id: 'cust-1' },
        { assignedExecId: EXECUTIVE_A.sub },
      ]);
    });
  });

  describe('create ownership (Spec 2.2)', () => {
    const dto = {
      name: 'Asha Rao',
      phone: '9990001111',
      plan: 'Gold',
      amount: 90000,
    };

    it('assigns an Executive-created customer to that Executive', async () => {
      await service.create(dto as any, EXECUTIVE_A);
      const { data } = prisma.customer.create.mock.calls[0][0];
      expect(data.assignedExecId).toBe(EXECUTIVE_A.sub);
    });

    it('ignores an attempt by an Executive to assign someone else', async () => {
      await service.create(
        { ...dto, assignedExecId: 'exec-b' } as any,
        EXECUTIVE_A,
      );
      const { data } = prisma.customer.create.mock.calls[0][0];
      expect(data.assignedExecId).toBe(EXECUTIVE_A.sub);
      expect(prisma.user.findFirst).not.toHaveBeenCalled();
    });

    it("DENIES a Manager assigning to another Manager's executive", async () => {
      prisma.user.findFirst.mockResolvedValue(null); // out of team
      await expect(
        service.create({ ...dto, assignedExecId: 'exec-x' } as any, MANAGER_1),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.customer.create).not.toHaveBeenCalled();
    });

    it('ALLOWS a Manager assigning within their own team', async () => {
      prisma.user.findFirst.mockResolvedValue({
        id: 'exec-own',
        isActive: true,
      });
      await service.create(
        { ...dto, assignedExecId: 'exec-own' } as any,
        MANAGER_1,
      );
      const { data } = prisma.customer.create.mock.calls[0][0];
      expect(data.assignedExecId).toBe('exec-own');
    });

    it('rejects assigning to a deactivated user', async () => {
      prisma.user.findFirst.mockResolvedValue({
        id: 'exec-off',
        isActive: false,
      });
      await expect(
        service.create({ ...dto, assignedExecId: 'exec-off' } as any, MANAGER_1),
      ).rejects.toThrow(BadRequestException);
    });

    /*
     * The check reads through findFirst now, not findUnique: phone stopped being
     * a unique column when the legacy sheet turned out to contain two members
     * sharing one number. The rule for manual entry is unchanged — only where
     * it is enforced moved, from the database to the service.
     */
    it('rejects a duplicate phone number', async () => {
      prisma.customer.findFirst.mockResolvedValue({ id: 'existing' });
      await expect(service.create(dto as any, SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.customer.create).not.toHaveBeenCalled();
    });

    it('rejects a duplicate membership ID', async () => {
      prisma.customer.findFirst
        // no phone clash
        .mockResolvedValueOnce(null)
        // but the MAF number is taken
        .mockResolvedValueOnce({ id: 'existing' });

      await expect(
        service.create({ ...dto, membershipId: 'MAF-140951' } as any, SUPER_ADMIN),
      ).rejects.toThrow(/membership ID already exists/);
      expect(prisma.customer.create).not.toHaveBeenCalled();
    });

    it('derives the pending amount from amount - amountPaid', async () => {
      await service.create(
        { ...dto, amountPaid: 30000 } as any,
        SUPER_ADMIN,
      );
      const { data } = prisma.customer.create.mock.calls[0][0];
      expect(data.pendingAmount).toBe(60000);
    });

    it('emails the customer their details when an address is on file (Spec 14)', async () => {
      prisma.customer.create.mockResolvedValue({
        id: 'cust-new',
        name: 'Asha Rao',
        email: 'asha@example.com',
        plan: 'Gold',
        amount: 90000,
        amountPaid: 30000,
        pendingAmount: 60000,
        validity: '5 Years',
        totalDays: 4,
        totalNights: 3,
        membershipId: null,
        assignedExecId: EXECUTIVE_A.sub,
      });

      await service.create({ ...dto, email: 'asha@example.com' } as any, EXECUTIVE_A);

      expect(notifications.notifyNewCustomer).toHaveBeenCalledWith(
        expect.objectContaining({
          customerEmail: 'asha@example.com',
          plan: 'Gold',
          pendingAmount: 60000,
        }),
      );
    });

    it('sends nothing when the customer has no email', async () => {
      prisma.customer.create.mockResolvedValue({
        id: 'cust-new',
        name: 'Asha Rao',
        email: null,
        plan: 'Gold',
        amount: 90000,
        amountPaid: 0,
        pendingAmount: 90000,
        assignedExecId: EXECUTIVE_A.sub,
      });

      await service.create(dto as any, EXECUTIVE_A);
      expect(notifications.notifyNewCustomer).not.toHaveBeenCalled();
    });

    it('a failed notification does not fail the customer create', async () => {
      prisma.customer.create.mockResolvedValue({
        id: 'cust-new',
        name: 'Asha Rao',
        email: 'asha@example.com',
        plan: 'Gold',
        amount: 90000,
        amountPaid: 0,
        pendingAmount: 90000,
        assignedExecId: EXECUTIVE_A.sub,
      });
      notifications.notifyNewCustomer.mockRejectedValue(new Error('SMTP down'));

      // The customer is already committed, so this must still resolve.
      await expect(
        service.create({ ...dto, email: 'asha@example.com' } as any, EXECUTIVE_A),
      ).resolves.toMatchObject({ id: 'cust-new' });
    });

    it('never returns a negative pending amount', async () => {
      await service.create(
        { ...dto, amount: 1000, amountPaid: 5000 } as any,
        SUPER_ADMIN,
      );
      const { data } = prisma.customer.create.mock.calls[0][0];
      expect(data.pendingAmount).toBe(0);
    });
  });

  describe('update', () => {
    const existing = {
      id: 'cust-1',
      name: 'Asha Rao',
      phone: '9990001111',
      email: null,
      plan: 'Gold',
      amount: 90000,
      amountPaid: 30000,
      pendingAmount: 60000,
      status: 'ACTIVE',
      assignedExecId: EXECUTIVE_A.sub,
      membershipId: null,
    };

    it('DENIES updating an out-of-scope customer as 404', async () => {
      prisma.customer.findFirst.mockResolvedValue(null);
      await expect(
        service.update('cust-b', { name: 'X' }, EXECUTIVE_A),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.customer.update).not.toHaveBeenCalled();
    });

    it('blocks an Executive from reassigning a customer away', async () => {
      prisma.customer.findFirst.mockResolvedValue(existing);
      await expect(
        service.update('cust-1', { assignedExecId: 'exec-b' }, EXECUTIVE_A),
      ).rejects.toThrow(BadRequestException);
    });

    it('recalculates the pending amount when the paid amount changes', async () => {
      prisma.customer.findFirst.mockResolvedValue(existing);
      await service.update('cust-1', { amountPaid: 90000 }, SUPER_ADMIN);
      const { data } = prisma.customer.update.mock.calls[0][0];
      expect(data.pendingAmount).toBe(0);
    });
  });

  describe('remove (Spec 6.3)', () => {
    /** Zero of everything, for a customer that really is deletable. */
    const NO_HISTORY = {
      payments: 0,
      refunds: 0,
      bookings: 0,
      entitlementLog: 0,
      memberships: 0,
    };

    it('refuses to delete a customer holding financial history', async () => {
      prisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        name: 'Asha',
        status: 'ACTIVE',
        _count: { ...NO_HISTORY, payments: 2 },
      });

      await expect(service.remove('cust-1', SUPER_ADMIN)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.customer.delete).not.toHaveBeenCalled();
    });

    it('deletes a customer with no history', async () => {
      prisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        name: 'Asha',
        status: 'PENDING',
        _count: NO_HISTORY,
      });

      await expect(service.remove('cust-1', SUPER_ADMIN)).resolves.toEqual({
        message: 'Customer deleted successfully',
      });
      expect(prisma.customer.delete).toHaveBeenCalled();
    });

    it('scopes the lookup, so an out-of-team id 404s rather than 403s', async () => {
      prisma.customer.findFirst.mockResolvedValue(null);

      await expect(service.remove('cust-1', EXECUTIVE_A)).rejects.toThrow(
        NotFoundException,
      );

      const { where } = prisma.customer.findFirst.mock.calls[0][0];
      expect(where.AND[1]).toEqual({ assignedExecId: EXECUTIVE_A.sub });
    });

    /*
     * The counts the list sends to the browser and the counts this guard reads
     * must be the same set, or the UI hides a delete button the API would have
     * allowed — or worse, offers one it will refuse.
     */
    it('asks for every blocker the list payload exposes', async () => {
      prisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        name: 'Asha',
        status: 'PENDING',
        _count: NO_HISTORY,
      });

      await service.remove('cust-1', SUPER_ADMIN);

      const { include } = prisma.customer.findFirst.mock.calls[0][0];
      expect(Object.keys(include._count.select).sort()).toEqual([
        'bookings',
        'entitlementLog',
        'memberships',
        'payments',
        'refunds',
      ]);
    });
  });

  /*
   * The tiles above the customer list. They used to ignore the filters
   * entirely: picking one Executive narrowed the table to their 198 customers
   * while the headline still read 835, and the money totalled the whole
   * business. A summary that does not describe the rows beneath it is worse
   * than no summary.
   */
  describe('getStats', () => {
    /** The `where` of the Nth count() call. */
    const countWhere = (n = 0) =>
      prisma.customer.count.mock.calls[n][0].where;

    it('scopes the counters to the caller', async () => {
      await service.getStats({}, EXECUTIVE_A);
      expect(countWhere().AND[0]).toEqual({
        assignedExecId: EXECUTIVE_A.sub,
      });
    });

    it('narrows every counter by the owner filter', async () => {
      await service.getStats({ assignedExecId: 'exec-b' }, SUPER_ADMIN);

      // Every count, not just the first — otherwise Total would be filtered
      // while Active was not.
      for (const call of prisma.customer.count.mock.calls) {
        expect(call[0].where.AND).toContainEqual({ assignedExecId: 'exec-b' });
      }
    });

    it('narrows the money aggregate by the same filter', async () => {
      await service.getStats({ assignedExecId: 'exec-b' }, SUPER_ADMIN);

      const { where } = prisma.customer.aggregate.mock.calls[0][0];
      expect(where.AND).toContainEqual({ assignedExecId: 'exec-b' });
    });

    it('narrows by plan, manager and search too', async () => {
      await service.getStats(
        {
          plan: 'Silver',
          assignedManagerId: '11111111-1111-4111-8111-111111111111',
          search: 'raj',
        },
        SUPER_ADMIN,
      );

      const and = countWhere().AND;
      expect(and).toContainEqual({ plan: 'Silver' });
      expect(and).toContainEqual({
        assignedExec: { managerId: '11111111-1111-4111-8111-111111111111' },
      });
      expect(JSON.stringify(and)).toContain('raj');
    });

    /*
     * The status counters are a breakdown BY status and double as the switcher
     * between them. Applying the status filter would collapse the breakdown —
     * click "Cancelled" and Total would read 3 as well, with no way back.
     */
    it('leaves the status counters unfiltered by status', async () => {
      await service.getStats({ status: 'CANCELLED' }, SUPER_ADMIN);

      for (const call of prisma.customer.count.mock.calls) {
        const explicit = call[0].where.AND.filter(
          (c: any) => c.status === 'CANCELLED',
        );
        // At most the one this particular counter adds for itself.
        expect(explicit.length).toBeLessThanOrEqual(1);
      }
      // The first call is the Total, which must carry no status at all.
      expect(countWhere().AND).not.toContainEqual({ status: 'CANCELLED' });
    });

    /*
     * The money tiles do describe the rows on screen, so they DO honour the
     * status filter.
     */
    it('applies the status filter to the money aggregate', async () => {
      await service.getStats({ status: 'CANCELLED' }, SUPER_ADMIN);

      const { where } = prisma.customer.aggregate.mock.calls[0][0];
      expect(where.AND).toContainEqual({ status: 'CANCELLED' });
    });

    it('reports what the figures were narrowed by', async () => {
      const res = await service.getStats(
        { assignedExecId: 'exec-b', status: 'ACTIVE' },
        SUPER_ADMIN,
      );

      expect(res.scopedBy).toMatchObject({
        assignedExecId: 'exec-b',
        status: 'ACTIVE',
      });
    });
  });

  /*
   * The bug these cover: "Amount paid" on the intake form wrote only the
   * aggregate on Customer, so recording that same money from the payment panel
   * added it a second time — ₹1,00,000 collected once showed as ₹2,00,000 paid
   * against a ₹1,00,000 plan, with a single row in the history to explain it.
   * The invariant being pinned is amountPaid === SUM(payment rows).
   */
  describe('amount paid stays the sum of the payment rows', () => {
    const dto = {
      name: 'Asha',
      phone: '9990001111',
      plan: 'Silver',
      amount: 100000,
      amountPaid: 100000,
      paymentMethod: 'Bank Transfer',
    };

    it('records the opening amount as a payment row, not just an aggregate', async () => {
      await service.create(dto, SUPER_ADMIN);

      expect(prisma.payment.create).toHaveBeenCalledTimes(1);
      const { data } = prisma.payment.create.mock.calls[0][0];
      expect(data).toMatchObject({
        customerId: 'cust-new',
        amount: 100000,
        method: 'Bank Transfer',
      });
    });

    it('writes no payment row when nothing was collected', async () => {
      await service.create({ ...dto, amountPaid: 0 }, SUPER_ADMIN);
      expect(prisma.payment.create).not.toHaveBeenCalled();
    });

    it('omits a method rather than inventing one', async () => {
      await service.create(
        { ...dto, paymentMethod: undefined },
        SUPER_ADMIN,
      );
      const { data } = prisma.payment.create.mock.calls[0][0];
      expect(data.method).toBeNull();
    });

    it('refuses to let amountPaid be typed over once rows exist', async () => {
      prisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        amount: 100000,
        amountPaid: 100000,
        assignedExecId: 'exec-1',
        membershipId: null,
      });
      prisma.payment.count.mockResolvedValue(1);

      await expect(
        service.update('cust-1', { amountPaid: 200000 }, SUPER_ADMIN),
      ).rejects.toThrow(ConflictException);
      expect(prisma.customer.update).not.toHaveBeenCalled();
    });

    it('allows an unchanged amountPaid through even with rows present', async () => {
      prisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        amount: 100000,
        amountPaid: 100000,
        assignedExecId: 'exec-1',
        membershipId: null,
      });
      prisma.payment.count.mockResolvedValue(3);

      await service.update(
        'cust-1',
        { amountPaid: 100000, name: 'Asha R' },
        SUPER_ADMIN,
      );
      expect(prisma.customer.update).toHaveBeenCalled();
      expect(prisma.payment.create).not.toHaveBeenCalled();
    });

    it('back-fills the missing row when a row-less opening balance is set', async () => {
      prisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        amount: 100000,
        amountPaid: 0,
        assignedExecId: 'exec-1',
        membershipId: null,
      });
      prisma.payment.count.mockResolvedValue(0);

      await service.update('cust-1', { amountPaid: 40000 }, SUPER_ADMIN);

      const { data } = prisma.payment.create.mock.calls[0][0];
      expect(data).toMatchObject({ customerId: 'cust-1', amount: 40000 });
    });

    /*
     * The same money must not answer differently depending on which screen
     * entered it: PaymentsService attributes a payment to the customer's single
     * ACTIVE membership, so this path has to as well.
     */
    it('attributes the back-filled row to the one active membership', async () => {
      prisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        amount: 100000,
        amountPaid: 0,
        assignedExecId: 'exec-1',
        membershipId: null,
      });
      prisma.payment.count.mockResolvedValue(0);
      prisma.membership.findMany.mockResolvedValue([{ id: 'ms-1' }]);

      await service.update('cust-1', { amountPaid: 40000 }, SUPER_ADMIN);

      const { data } = prisma.payment.create.mock.calls[0][0];
      expect(data.membershipId).toBe('ms-1');
    });

    it('leaves it unattributed rather than guessing between two plans', async () => {
      prisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        amount: 100000,
        amountPaid: 0,
        assignedExecId: 'exec-1',
        membershipId: null,
      });
      prisma.payment.count.mockResolvedValue(0);
      prisma.membership.findMany.mockResolvedValue([
        { id: 'ms-1' },
        { id: 'ms-2' },
      ]);

      await service.update('cust-1', { amountPaid: 40000 }, SUPER_ADMIN);

      const { data } = prisma.payment.create.mock.calls[0][0];
      expect(data.membershipId).toBeNull();
    });
  });


  describe('status is a mirror, not a field to type into', () => {
    beforeEach(() => {
      prisma.customer.findFirst.mockResolvedValue({
        id: 'cust-1',
        amount: 100000,
        amountPaid: 0,
        status: 'CANCELLED',
        assignedExecId: 'exec-1',
        membershipId: null,
      });
    });

    it('refuses a direct status change once memberships exist', async () => {
      prisma.membership.count.mockResolvedValue(1);

      await expect(
        service.update('cust-1', { status: 'ACTIVE' }, SUPER_ADMIN),
      ).rejects.toThrow(ConflictException);
      expect(prisma.customer.update).not.toHaveBeenCalled();
    });

    it('allows it while the customer has no plan to derive from', async () => {
      prisma.membership.count.mockResolvedValue(0);

      await service.update('cust-1', { status: 'ACTIVE' }, SUPER_ADMIN);

      const { data } = prisma.customer.update.mock.calls[0][0];
      expect(data.status).toBe('ACTIVE');
    });

    it('lets an unchanged status through untouched', async () => {
      prisma.membership.count.mockResolvedValue(3);

      await service.update(
        'cust-1',
        { status: 'CANCELLED', name: 'Asha R' },
        SUPER_ADMIN,
      );

      expect(prisma.customer.update).toHaveBeenCalled();
    });
  });


  describe('the refusal to delete explains itself accurately', () => {
    const withHistory = {
      id: 'cust-1',
      name: 'Asha Rao',
      phone: '999',
      plan: 'Silver',
      amount: 100000,
      amountPaid: 0,
      assignedExecId: 'exec-1',
      membershipId: null,
      _count: {
        payments: 1,
        refunds: 0,
        bookings: 0,
        entitlementLog: 2,
        memberships: 1,
      },
    };

    it('pluralises each blocker instead of reading "1 payments"', async () => {
      prisma.customer.findFirst.mockResolvedValue({
        ...withHistory,
        status: 'ACTIVE',
      });

      await expect(service.remove('cust-1', SUPER_ADMIN)).rejects.toThrow(
        /1 payment, 2 entitlement ledger entries, 1 membership on record/,
      );
    });

    /*
     * The old wording told the user to set the status to CANCELLED. Status is
     * now a mirror of the memberships, so following that advice earns a second
     * 409 — a refusal that sends the user into another refusal.
     */
    it('never advises setting the status directly', async () => {
      prisma.customer.findFirst.mockResolvedValue({
        ...withHistory,
        status: 'ACTIVE',
      });

      await expect(service.remove('cust-1', SUPER_ADMIN)).rejects.toThrow(
        /Cancel or expire their membership instead/,
      );
    });

    it('does not tell an already-cancelled customer to cancel again', async () => {
      prisma.customer.findFirst.mockResolvedValue({
        ...withHistory,
        status: 'CANCELLED',
      });

      await expect(service.remove('cust-1', SUPER_ADMIN)).rejects.toThrow(
        /already cancelled/,
      );
    });

    it('still deletes a customer with no history at all', async () => {
      prisma.customer.findFirst.mockResolvedValue({
        ...withHistory,
        status: 'PENDING',
        _count: {
          payments: 0,
          refunds: 0,
          bookings: 0,
          entitlementLog: 0,
          memberships: 0,
        },
      });

      await expect(service.remove('cust-1', SUPER_ADMIN)).resolves.toEqual({
        message: 'Customer deleted successfully',
      });
      expect(prisma.customer.delete).toHaveBeenCalled();
    });
  });


  /*
   * The gap this closes: the intake form picks a plan from the catalogue and
   * fills the customer's plan, amount, days and nights from it -- but recorded
   * no Membership. So a customer read "Plan: Bronze, 6 Months" while the page
   * showed 0 plan purchases, 0 nights, and an opening payment attributed to no
   * plan at all. Spec 8.1 always described one transaction.
   */
  describe('intake records the plan purchase, not just its name', () => {
    const dto = {
      name: 'Asha',
      phone: '9990001111',
      plan: 'Bronze',
      amount: 50000,
      amountPaid: 20000,
      packageId: '11111111-1111-4111-8111-111111111111',
    };

    const BRONZE = {
      id: dto.packageId,
      name: 'Bronze',
      validityMonths: 6,
      isActive: true,
    };

    it('records the sale in the same transaction as the customer', async () => {
      prisma.package.findUnique.mockResolvedValue(BRONZE);

      await service.create(dto, SUPER_ADMIN);

      expect(memberships.recordSaleWithinTransaction).toHaveBeenCalledTimes(1);
      const [, params] = memberships.recordSaleWithinTransaction.mock.calls[0];
      expect(params).toMatchObject({
        customerId: 'cust-new',
        packageId: dto.packageId,
        actorId: SUPER_ADMIN.sub,
      });
    });

    /*
     * Dates are deliberately NOT computed here. Doing so once produced a
     * 7-month plan from a 6-month one: setMonth(+6) on 31 August asks for
     * 31 February, which JavaScript rolls into March. MembershipsService owns
     * the month-end clamp, so intake must leave the dates to it.
     */
    it('leaves the dates to MembershipsService and its month-end clamp', async () => {
      prisma.package.findUnique.mockResolvedValue(BRONZE);

      await service.create(dto, SUPER_ADMIN);

      const [, params] = memberships.recordSaleWithinTransaction.mock.calls[0];
      expect(params.startDate).toBeUndefined();
      expect(params.endDate).toBeUndefined();
    });

    it('records no membership when no plan is being sold yet', async () => {
      await service.create({ ...dto, packageId: undefined }, SUPER_ADMIN);

      // A customer may legitimately be entered before a plan is agreed.
      expect(memberships.recordSaleWithinTransaction).not.toHaveBeenCalled();
      expect(prisma.customer.create).toHaveBeenCalled();
    });

    it('rejects an unknown plan before creating anything', async () => {
      prisma.package.findUnique.mockResolvedValue(null);

      await expect(service.create(dto, SUPER_ADMIN)).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.customer.create).not.toHaveBeenCalled();
    });

    it('refuses to sell an inactive plan', async () => {
      prisma.package.findUnique.mockResolvedValue({
        ...BRONZE,
        isActive: false,
      });

      await expect(service.create(dto, SUPER_ADMIN)).rejects.toThrow(
        /inactive and cannot be sold/,
      );
      expect(prisma.customer.create).not.toHaveBeenCalled();
    });

    it('writes the opening payment before the sale, so it can be attributed', async () => {
      prisma.package.findUnique.mockResolvedValue(BRONZE);
      const order: string[] = [];
      prisma.payment.create.mockImplementation(async () => {
        order.push('payment');
        return { id: 'pay-new', method: null };
      });
      memberships.recordSaleWithinTransaction.mockImplementation(async () => {
        order.push('sale');
        return { id: 'ms-new' };
      });

      await service.create(dto, SUPER_ADMIN);

      // recordSaleWithinTransaction claims every unattached payment on the
      // customer, so the payment has to exist by the time it runs.
      expect(order).toEqual(['payment', 'sale']);
    });
  });

});
