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
  /** The authoritative figure: SUM of every ledger movement. */
  nights: number;
  /** Derived from nights, never summed or stored. See daysForNights. */
  days: number;
}

/** A movement to append to the ledger. Rows are never updated or deleted. */
export interface LedgerMovement {
  customerId: string;
  membershipId?: string | null;
  bookingId?: string | null;
  type: LedgerTypeValue;
  /** Positive credits, negative debits. Nights are the whole budget. */
  nights: number;
  description?: string | null;
  actorId?: string | null;
  date?: Date;
}
