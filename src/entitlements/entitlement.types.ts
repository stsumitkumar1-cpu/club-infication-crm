/**
 * Entitlement movement types — Master Spec 7.
 *
 * Only the five types the spec confirms are enabled. TRANSFER, GIFT, SPLIT and
 * ADVANCE are deliberately absent: §7 forbids inventing them, and §21.1 forbids
 * inventing undocumented business rules generally.
 */
export const LedgerType = {
  /** +N nights on membership creation, from the package's nights. */
  ALLOCATION: 'ALLOCATION',
  /** -N when a booking is confirmed. */
  BOOKING_USAGE: 'BOOKING_USAGE',
  /** +N when a booking is cancelled, restoring exactly what it consumed. */
  CANCELLATION: 'CANCELLATION',
  /** ±N manual correction by a Super Admin. */
  ADJUSTMENT: 'ADJUSTMENT',
  /** Closes whatever remains when a membership ends. */
  EXPIRY: 'EXPIRY',
} as const;

export type LedgerTypeValue = (typeof LedgerType)[keyof typeof LedgerType];

export const LEDGER_TYPES = Object.values(LedgerType);

/**
 * Which pool a movement belongs to.
 *
 * Complimentary nights are a gift on top of the plan ("02N/03D Complimentary"
 * in the legacy sheet, present on 545 of 821 rows). The client asked for them
 * to be counted apart from the plan's own nights — mixing them makes "how many
 * nights are left on your plan" unanswerable.
 */
export const EntitlementBucket = {
  PLAN: 'PLAN',
  COMPLIMENTARY: 'COMPLIMENTARY',
} as const;

export type EntitlementBucketValue =
  (typeof EntitlementBucket)[keyof typeof EntitlementBucket];

/**
 * Which membership year a date falls in, 1-based, or null before the term
 * starts.
 *
 * Year 1 runs from the start date to the day before its first anniversary, and
 * so on. Capped at the term length so a date past the end reports the final
 * year rather than an nth year that was never sold.
 */
export function membershipYearFor(
  startDate: Date,
  totalYears: number,
  at: Date = new Date(),
): number | null {
  if (at < startDate) {
    return null;
  }

  /*
   * Counted by calendar anniversary rather than by dividing elapsed days, so
   * leap years and month lengths cannot drift the boundary. A member whose term
   * began on 29 February rolls over on 1 March in non-leap years, which is what
   * the same-day-of-month comparison below produces.
   */
  let years = at.getFullYear() - startDate.getFullYear();
  const beforeAnniversary =
    at.getMonth() < startDate.getMonth() ||
    (at.getMonth() === startDate.getMonth() &&
      at.getDate() < startDate.getDate());
  if (beforeAnniversary) {
    years -= 1;
  }

  return Math.min(Math.max(years + 1, 1), Math.max(totalYears, 1));
}

/** The date year N of a term begins. */
export function membershipYearStart(startDate: Date, yearIndex: number): Date {
  const d = new Date(startDate);
  d.setFullYear(d.getFullYear() + (yearIndex - 1));
  return d;
}

/**
 * Days a night balance is worth when taken as ONE continuous stay, which is how
 * the client quotes plans ("3 Nights / 4 Days").
 *
 * Days are deliberately not a budget. A "10 days / 9 nights" plan is really one
 * 9-night holiday: split it into three 3-night stays and the nights still add
 * up to 9 while the day-spans add up to 12, so a plan sold as usable would
 * refuse its own last booking. Nights are the only quantity the ledger moves;
 * days are derived on read, so they can never disagree with it.
 */
export function daysForNights(nights: number): number {
  return nights > 0 ? nights + 1 : 0;
}

export interface EntitlementBalance {
  /**
   * Nights available now from the PLAN, as a SUM of every ledger movement.
   *
   * On an annual plan this is the current year's remainder and nothing else:
   * each past year is closed by an explicit EXPIRY row for exactly what was
   * left, so summing the whole ledger cancels those years out. That is why the
   * balance stays a plain SUM even though entitlement is annual.
   */
  nights: number;

  /** Derived from nights, never summed or stored. See daysForNights. */
  days: number;

  /** Complimentary nights, counted apart from the plan at the client's request. */
  complimentaryNights: number;

  /** Which membership year the plan figure belongs to; null if not annual. */
  yearIndex?: number | null;
}

/** A movement to append to the ledger. Rows are never updated or deleted. */
export interface LedgerMovement {
  customerId: string;
  membershipId?: string | null;
  bookingId?: string | null;
  type: LedgerTypeValue;

  /** Defaults to PLAN. */
  bucket?: EntitlementBucketValue;

  /**
   * Which membership year the movement concerns. Required for the annual
   * allocations and expiries; null for anything that is not year-scoped.
   */
  yearIndex?: number | null;

  /** Positive credits, negative debits. Nights are the whole budget. */
  nights: number;
  description?: string | null;
  actorId?: string | null;
  date?: Date;
}
