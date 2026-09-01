import { Prisma, Role } from '@prisma/client';
import type { AuthUser } from '../types/index.js';

/**
 * Record-level scope for customer data — Master Spec 2.3.
 *
 * Returned as a Prisma `where` fragment so it can be AND-ed into the query
 * itself. Scope must never be applied as a post-fetch check: an out-of-scope
 * id has to be indistinguishable from a missing one, otherwise the 403/404
 * difference leaks the existence of other teams' records (IDOR).
 *
 * Later phases (payments, memberships, bookings, entitlements) all hang off a
 * customer, so they reuse this filter via a nested `customer: { ... }` relation
 * rather than re-deriving the rules.
 *
 * A customer with no assigned Executive is visible to SUPER_ADMIN only — with
 * no owner there is no team it can belong to.
 */
export function customerScopeFilter(user: AuthUser): Prisma.CustomerWhereInput {
  switch (user.role) {
    case Role.SUPER_ADMIN:
      return {};

    case Role.MANAGER:
      // Own executives' customers, plus any the manager holds directly.
      return {
        OR: [
          { assignedExec: { managerId: user.sub } },
          { assignedExecId: user.sub },
        ],
      };

    default:
      return { assignedExecId: user.sub };
  }
}

/**
 * Scope for anything that hangs off a customer — memberships now, payments,
 * refunds, bookings and ledger entries in later phases.
 *
 * Derived from `customerScopeFilter` rather than re-stating the rules, so the
 * team/ownership logic exists in exactly one place.
 */
export function membershipScopeFilter(
  user: AuthUser,
): Prisma.MembershipWhereInput {
  if (user.role === Role.SUPER_ADMIN) {
    return {};
  }
  return { customer: customerScopeFilter(user) };
}

/**
 * Who may a given caller hand a customer to?
 *
 * - EXECUTIVE  → themselves only.
 * - MANAGER    → one of their own executives, or themselves.
 * - SUPER_ADMIN→ any active user.
 *
 * Returned as a `where` fragment for a User lookup, so an out-of-team target
 * simply fails to resolve instead of being reported as forbidden.
 */
export function assignableUserFilter(user: AuthUser): Prisma.UserWhereInput {
  switch (user.role) {
    case Role.SUPER_ADMIN:
      return {};

    case Role.MANAGER:
      return { OR: [{ managerId: user.sub }, { id: user.sub }] };

    default:
      return { id: user.sub };
  }
}
