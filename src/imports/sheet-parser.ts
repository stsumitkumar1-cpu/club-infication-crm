/**
 * Reads the legacy "Member sheet of Club Infication" workbook.
 *
 * Everything in here is a pure function over cell values, with no database and
 * no Nest, so the awkward parts can be tested directly — and they are the whole
 * job. The workbook is 29 monthly tabs of 821 rows written by hand over two
 * years, so almost every column needs interpreting rather than reading:
 *
 *   "Nil" and "-"              mean empty, in 605 and a handful of rows
 *   "05Years" / "05years"      is a validity, not a plan name
 *   "06N/07Days"               is the annual entitlement, as one string
 *   "30Nights"                 is the lifetime total, with its unit attached
 *   "1,25,000"                 is a number
 *   "9813622308/951802113"     is two phone numbers in one cell
 *   "Zoya Sekhon" / "Zoya"     is one consultant spelled several ways
 *   "02N/03D Complimentary"    is two free nights on top of the plan
 *   45231                      is an Excel date serial
 *
 * Nothing here guesses. Where a value cannot be read with confidence it is
 * reported as an issue and the original text is carried through, because the
 * client's instruction was to import what the sheet says and correct it in the
 * CRM afterwards.
 */

/** A value the sheet uses to mean "nothing". */
const BLANKS = new Set(['', '-', 'nil', 'n/a', 'na', 'null', '--']);

export function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  return BLANKS.has(String(value).trim().toLowerCase());
}

export function text(value: unknown): string | null {
  if (isBlank(value)) return null;
  return String(value).trim();
}

/**
 * A rupee figure. Handles Indian grouping ("1,25,000"), stray currency words
 * and decimals; anything with no digits at all is treated as absent rather than
 * as zero, so "vu" in one Paid Amt cell does not become a payment of nothing.
 */
export function money(value: unknown): number | null {
  if (isBlank(value)) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;

  const digits = String(value).replace(/[^\d.]/g, '');
  if (!digits || digits === '.') return null;

  const n = Number.parseFloat(digits);
  return Number.isFinite(n) ? n : null;
}

/** Whole number, or null. */
export function integer(value: unknown): number | null {
  const n = money(value);
  return n === null ? null : Math.round(n);
}

/**
 * The "Product" column: "03Years", "05years", "05 years", "01Year".
 * Returns the number of years.
 */
export function years(value: unknown): number | null {
  if (isBlank(value)) return null;
  const m = String(value).match(/(\d+)\s*years?/i);
  return m ? Number.parseInt(m[1], 10) : null;
}

/**
 * "Nights Per Year": "06N/07Days", "04N/05days", "05N/06D".
 *
 * Days is reported as the sheet wrote it rather than recomputed, so a mismatch
 * (one row says "04N/06Days") surfaces as data to check instead of being
 * silently corrected.
 */
export function nightsPerYear(
  value: unknown,
): { nights: number; days: number | null } | null {
  if (isBlank(value)) return null;
  const s = String(value);
  const nights = s.match(/(\d+)\s*N/i);
  if (!nights) return null;
  const days = s.match(/(\d+)\s*D/i);
  return {
    nights: Number.parseInt(nights[1], 10),
    days: days ? Number.parseInt(days[1], 10) : null,
  };
}

/** "Total Nights": "30Nights", "12 Nights", "6". */
export function totalNights(value: unknown): number | null {
  return integer(value);
}

/**
 * Splits a phone cell into a main number and an alternative.
 *
 * 175 rows hold two numbers separated by a slash, comma or "/". The client
 * confirmed both are wanted, with the first as the main contact. Digits are
 * kept as written — no length validation here, because a 9- or 11-digit number
 * is still the number the team has, and rejecting it would lose the customer.
 */
export function phones(value: unknown): { phone: string | null; altPhone: string | null } {
  if (isBlank(value)) return { phone: null, altPhone: null };

  const parts = String(value)
    .split(/[\/,;|]| and |&/i)
    .map((p) => p.replace(/[^\d+]/g, '').trim())
    .filter((p) => p.length >= 4);

  return {
    phone: parts[0] ?? null,
    altPhone: parts.length > 1 ? parts.slice(1).join(' / ') : null,
  };
}

/**
 * Free nights promised in the "Offers" column.
 *
 * "02N/03D Complimentary" and "01N,RCV-1500,ATV-1500" both grant nights; "Food
 * Voucher of INR3000/-" and "No Gift Charge" grant none. Only a night count
 * immediately followed by N is read, and only when the text actually mentions a
 * complimentary night — a bare "02N" in a remark about something else must not
 * become entitlement.
 */
export function complimentaryNights(value: unknown): number | null {
  if (isBlank(value)) return null;
  const s = String(value);

  // "02N/03D Complimentary", "01N Complimentary", "Complimentary 02N"
  const mentionsGift = /complimentar|complimentry|free\s*night|extra\s*night/i.test(s);
  if (!mentionsGift) return null;

  const m = s.match(/(\d+)\s*N\b/i);
  return m ? Number.parseInt(m[1], 10) : null;
}

/**
 * An Excel date cell.
 *
 * exceljs hands back a Date for a date-formatted cell and a number for one
 * typed as plain text, so both shapes have to be accepted. The serial is the
 * 1900 system Excel uses on Windows.
 */
export function excelDate(value: unknown): Date | null {
  if (isBlank(value)) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number' && value > 1 && value < 100000) {
    const ms = Math.round((value - 25569) * 86400 * 1000);
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // Written out by hand: "05-07-2024", "1-3July2026", "09-04-2025".
  const s = String(value).trim();
  const dmy = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})$/);
  if (dmy) {
    const [, dd, mm, yy] = dmy;
    const year = yy.length === 2 ? 2000 + Number(yy) : Number(yy);
    // Day-first, which is how the sheet writes every date it spells out.
    const d = new Date(year, Number(mm) - 1, Number(dd));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  return null;
}

/**
 * The payment methods the CRM offers. The client asked for a fixed list with
 * room to type anything else, so this is the list and the free text is the
 * fallback.
 */
export const PAYMENT_METHODS = [
  'Cash',
  'UPI',
  'Credit Card',
  'Debit Card',
  'Cheque',
  'Bank Transfer',
] as const;

/**
 * Pulls a method out of the sheet's free-text "Mode Of Payment".
 *
 * The column mixes the amount, the method and sometimes the bank into one
 * string: "5000 Paid Through UPI", "40000 Paid Through CC", "30000 paid
 * through ICICI CC 12,500 Paid through DC", "Paid 5000 from G.Pay". Only the
 * method is wanted — the amount is already in Paid Amt, and storing the whole
 * sentence would make the payment-method filter useless.
 *
 * Returns the ORIGINAL text when nothing is recognised, rather than null: an
 * unrecognised method is still what the team wrote down, and dropping it would
 * lose the only record of how the money arrived.
 */
export function paymentMethod(value: unknown): string | null {
  const raw = text(value);
  if (!raw) return null;

  const s = raw.toLowerCase();

  /*
   * Ordered from most specific to least. "credit card" has to be tested before
   * a bare "cc", and "debit" before "card", or a debit-card payment would be
   * filed as credit.
   */
  const rules: [RegExp, string][] = [
    // "throughCC" with no space is a real value in the sheet, so the glued
    // form needs its own alternative — a word boundary will not find it.
    [/\bcredit\s*card\b|\bcc\b|creditcard|through\s*cc\b/, 'Credit Card'],
    [/\bdebit\s*card\b|\bdc\b|debitcard|through\s*dc\b/, 'Debit Card'],
    [/\bupi\b|g\.?\s*pay|gpay|google\s*pay|phone\s*pe|phonepe|paytm/, 'UPI'],
    [/\bcheque\b|\bcheck\b|\bdd\b|demand\s*draft/, 'Cheque'],
    [/bank\s*transfer|\bneft\b|\brtgs\b|\bimps\b|net\s*bank|online\s*transfer/, 'Bank Transfer'],
    [/\bcash\b/, 'Cash'],
    // Last resort among the recognised words: "Online" on its own is how the
    // team wrote a bank transfer in the earliest tabs.
    [/\bonline\b/, 'Bank Transfer'],
  ];

  for (const [pattern, method] of rules) {
    if (pattern.test(s)) return method;
  }

  return raw;
}

/**
 * Collapses the many spellings of one consultant to a comparison key.
 *
 * The sheet has 39 distinct spellings for roughly 20 people: "Vikramjit Singh"
 * and "Vikramjit singh"; "Zoya Sheikh", "Zoya sheikh", "Zoya" and "Zoya
 * Sekhon"; "Ankit Rathore" and "Ankit". Case and punctuation are normalised
 * here; the genuinely different spellings ("Sekhon" vs "Sheikh") need a human,
 * so they are surfaced for confirmation rather than merged by guesswork.
 */
export function consultantKey(value: unknown): string | null {
  const t = text(value);
  if (!t) return null;
  return t.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** First name, used to group spellings that differ only after it. */
export function consultantFirstName(value: unknown): string | null {
  const t = text(value);
  if (!t) return null;
  const first = t.trim().split(/\s+/)[0];
  return first ? first.toLowerCase().replace(/[^a-z0-9]/g, '') : null;
}

/**
 * One stay pulled out of the packed usage columns.
 *
 * `confident` is the whole point: a stay is only safe to turn into a Booking
 * when its nights and its dates could both be read. Where they could not, the
 * original text travels with it so a human can finish the job.
 */
export interface ParsedStay {
  nights: number | null;
  checkIn: Date | null;
  checkOut: Date | null;
  place: string | null;
  hotel: string | null;
  rawNights: string | null;
  rawDates: string | null;
  confident: boolean;
}

/** "02Night", "01N", "02Rooms for 02Nights=04Nights" -> the final figure. */
function stayNights(part: string): number | null {
  if (isBlank(part)) return null;

  /*
   * "02Rooms for 02Nights=04Nights" is an equation the team wrote out: rooms
   * times nights. The figure after the "=" is their own total, so it is the one
   * to trust rather than recomputing it.
   */
  const afterEquals = part.split('=').pop() ?? part;
  const m = afterEquals.match(/(\d+)\s*(?:nights?|n)\b/i);
  if (m) return Number.parseInt(m[1], 10);

  const bare = afterEquals.match(/(\d+)/);
  return bare ? Number.parseInt(bare[1], 10) : null;
}

/** "05-07-2024 to 07-07-2024", "25-03-2025to26-03-2025". */
function stayDates(part: string): { checkIn: Date | null; checkOut: Date | null } {
  if (isBlank(part)) return { checkIn: null, checkOut: null };

  const halves = String(part).split(/\s*to\s*/i);
  if (halves.length >= 2) {
    return {
      checkIn: excelDate(halves[0]),
      checkOut: excelDate(halves[halves.length - 1]),
    };
  }
  return { checkIn: excelDate(part), checkOut: null };
}

/**
 * Unpacks the stay columns, which hold several stays as parallel
 * slash-separated lists.
 *
 * The lists do not reliably line up: one row's Dates begins "Siya was not here"
 * — a note, not a date — so the nth night does not always belong to the nth
 * date. Rather than pairing blindly, each position is read independently and
 * marked `confident` only when both a night count and a usable date range came
 * out of it. Anything short of that is a stay for a human to enter.
 */
export function parseStays(
  usedNights: unknown,
  dates: unknown,
  place: unknown,
  hotel: unknown,
): ParsedStay[] {
  if (isBlank(usedNights)) return [];

  const split = (v: unknown) =>
    isBlank(v) ? [] : String(v).split('/').map((s) => s.trim());

  const nightParts = split(usedNights);
  const dateParts = split(dates);
  const placeParts = split(place);
  const hotelParts = split(hotel);

  return nightParts.map((np, i) => {
    const nights = stayNights(np);
    const rawDates = dateParts[i] ?? null;
    const { checkIn, checkOut } = stayDates(rawDates ?? '');

    /*
     * Both dates, in the right order, and a night count that matches the gap.
     * The order check is not paranoia: one row reads "09-04-2025to12-04-2024",
     * where the end is a year before the start.
     */
    let confident = false;
    if (nights !== null && checkIn && checkOut && checkOut > checkIn) {
      const gap = Math.round(
        (checkOut.getTime() - checkIn.getTime()) / 86400000,
      );
      confident = gap === nights;
    }

    return {
      nights,
      checkIn,
      checkOut,
      place: text(placeParts[i]),
      hotel: text(hotelParts[i]),
      rawNights: text(np),
      rawDates,
      confident,
    };
  });
}

/**
 * Header synonyms.
 *
 * The columns are the same across all 29 tabs; only their spelling drifts. Each
 * key here is a normalised header and each value is the field it means, so the
 * import reads one shape whichever month it is looking at.
 */
const HEADER_MAP: Record<string, string> = {
  date: 'saleDate',
  srno: 'serial',
  sno: 'serial',
  name: 'name',
  coapplicant: 'coApplicant',
  phoneno: 'phone',
  phone: 'phone',
  emailid: 'email',
  email: 'email',
  consultant: 'consultant',
  location: 'location',
  product: 'product',
  productcost: 'productCost',
  paidamt: 'paidAmount',
  modeofpayment: 'paymentMode',
  pending: 'pending',
  mafno: 'mafNo',
  ada: 'ada',
  adaannualdividedcost: 'ada',
  adapaid: 'adaPaid',
  adacharges: 'adaPaid',
  nightsperyear: 'nightsPerYear',
  totalnights: 'totalNights',
  totalnightsused: 'usedNights',
  usednights: 'usedNights',
  offers: 'offers',
  remarks: 'remarks',
  dates: 'stayDates',
  place: 'place',
  hotel: 'hotel',
  hotels: 'hotel',
  vcall: 'vCall',
  mailaddresscourier: 'courier',
  emimonth: 'emiMonth',
  emidocreceived: 'emiDoc',
  extraupdatebreakfastdinnerextramattress: 'extraUpdate',
};

export function normaliseHeader(header: unknown): string | null {
  const t = text(header);
  if (!t) return null;
  const key = t.toLowerCase().replace(/[^a-z0-9]/g, '');
  return HEADER_MAP[key] ?? null;
}

/** Field names a row can carry once its headers are mapped. */
export type SheetField =
  | 'saleDate' | 'serial' | 'name' | 'coApplicant' | 'phone' | 'email'
  | 'consultant' | 'location' | 'product' | 'productCost' | 'paidAmount'
  | 'paymentMode' | 'pending' | 'mafNo' | 'ada' | 'adaPaid' | 'nightsPerYear'
  | 'totalNights' | 'usedNights' | 'offers' | 'remarks' | 'stayDates'
  | 'place' | 'hotel' | 'vCall' | 'courier' | 'emiMonth' | 'emiDoc'
  | 'extraUpdate';

/**
 * Maps a whole header row, resolving the columns that share a name.
 *
 * This has to be done across the row rather than cell by cell, because several
 * tabs carry the word "Date" three times: the sale date in column 1, an EMI
 * date in the middle, and the stay date in the usage block. Mapping each cell
 * on its own let the last one overwrite the first, and 312 of 822 rows lost
 * their sale date — which would have back-dated every one of them to today and
 * put every membership in year 1.
 *
 * The rules, in order:
 *   - the first column claiming a field keeps it;
 *   - a later date column that sits AFTER "Used Nights" is the stay date, since
 *     the stay columns always travel together at the end of the row;
 *   - anything else that repeats is dropped, and reported.
 *
 * Returns an array indexed the same way as the header row, so a caller can walk
 * cells and look up the field by column.
 */
export function mapHeaderRow(headers: unknown[]): {
  fields: (SheetField | null)[];
  duplicates: string[];
} {
  const first = headers.map((h) => normaliseHeader(h) as SheetField | null);
  const usedNightsAt = first.findIndex((f) => f === 'usedNights');

  const fields: (SheetField | null)[] = new Array(headers.length).fill(null);
  const taken = new Map<SheetField, number>();
  const duplicates: string[] = [];

  first.forEach((field, col) => {
    if (!field) return;

    if (!taken.has(field)) {
      taken.set(field, col);
      fields[col] = field;
      return;
    }

    /*
     * A repeat. The one case worth rescuing is a second "Date" inside the usage
     * block — in two tabs the stay date column is headed "Date" rather than
     * "Dates", and dropping it would lose those stays entirely.
     */
    if (
      field === 'saleDate' &&
      usedNightsAt !== -1 &&
      col > usedNightsAt &&
      !taken.has('stayDates')
    ) {
      taken.set('stayDates', col);
      fields[col] = 'stayDates';
      return;
    }

    duplicates.push(
      `column ${col} repeats "${String(headers[col])}" (already at column ${taken.get(field)})`,
    );
  });

  return { fields, duplicates };
}

export type RawRow = Partial<Record<SheetField, unknown>>;

/** Anything about a row the reviewer needs to know before committing it. */
export interface RowIssue {
  field: string;
  severity: 'error' | 'warning';
  message: string;
}

export interface MappedRow {
  sheet: string;
  rowNumber: number;
  name: string | null;
  coApplicant: string | null;
  phone: string | null;
  altPhone: string | null;
  email: string | null;
  location: string | null;
  consultant: string | null;
  saleDate: Date | null;
  years: number | null;
  nightsPerYear: number | null;
  daysPerYear: number | null;
  totalNights: number | null;
  productCost: number | null;
  paidAmount: number | null;
  paymentMode: string | null;
  pending: number | null;
  mafNo: string | null;
  ada: number | null;
  adaPaid: number | null;
  offers: string | null;
  complimentaryNights: number | null;
  remarks: string | null;
  stays: ParsedStay[];
  /** Everything the stay columns said, kept verbatim. */
  usageNotes: string | null;
  issues: RowIssue[];
}

/** Turns one raw row into the shape the importer writes, plus its issues. */
export function mapRow(
  sheet: string,
  rowNumber: number,
  raw: RawRow,
): MappedRow {
  const issues: RowIssue[] = [];
  const add = (field: string, severity: RowIssue['severity'], message: string) =>
    issues.push({ field, severity, message });

  const name = text(raw.name);
  if (!name) add('name', 'error', 'No customer name, so there is nothing to import');

  const { phone, altPhone } = phones(raw.phone);
  if (!phone) {
    add('phone', 'warning', 'No phone number in the sheet');
  }
  if (altPhone) {
    add('phone', 'warning', `Two numbers in one cell; the first is the main contact, "${altPhone}" is the alternative`);
  }

  const consultant = text(raw.consultant);
  if (!consultant) {
    add('consultant', 'warning', 'No consultant named, so the customer will be unassigned');
  }

  const y = years(raw.product);
  if (!y) {
    add('product', 'error', `Cannot read a validity from "${text(raw.product) ?? '(blank)'}"`);
  }

  const npy = nightsPerYear(raw.nightsPerYear);
  if (!npy) {
    add('nightsPerYear', 'error', `Cannot read nights per year from "${text(raw.nightsPerYear) ?? '(blank)'}"`);
  }

  const total = totalNights(raw.totalNights);
  if (y && npy && total !== null && y * npy.nights !== total) {
    add(
      'totalNights',
      'warning',
      `${npy.nights} nights x ${y} years is ${y * npy.nights}, but the sheet says ${total}`,
    );
  }
  if (npy?.days !== null && npy && npy.days !== npy.nights + 1) {
    add('nightsPerYear', 'warning', `"${npy.nights}N/${npy.days}D" — days is usually nights + 1`);
  }

  const cost = money(raw.productCost);
  if (cost === null) {
    add('productCost', 'error', 'No plan cost in the sheet');
  }

  const paid = money(raw.paidAmount);
  if (paid === null && !isBlank(raw.paidAmount)) {
    add('paidAmount', 'warning', `Cannot read an amount from "${String(raw.paidAmount)}"`);
  }

  const saleDate = excelDate(raw.saleDate);
  if (!saleDate) {
    add('saleDate', 'warning', 'No sale date, so today will be used');
  }

  const mafNo = text(raw.mafNo);
  if (!mafNo) {
    add('mafNo', 'warning', 'No MAF number');
  }

  const stays = parseStays(raw.usedNights, raw.stayDates, raw.place, raw.hotel);
  const unreadable = stays.filter((s) => !s.confident);
  if (unreadable.length > 0) {
    add(
      'usedNights',
      'warning',
      `${unreadable.length} of ${stays.length} stay(s) could not be read reliably and will be kept as notes`,
    );
  }

  /*
   * Every stay column, verbatim, whenever there is any stay data at all — not
   * only for the ones that failed. If a booking is later found to be wrong, the
   * original wording is the only way back.
   */
  const usageParts = [
    text(raw.usedNights) && `Used Nights: ${text(raw.usedNights)}`,
    text(raw.stayDates) && `Dates: ${text(raw.stayDates)}`,
    text(raw.place) && `Place: ${text(raw.place)}`,
    text(raw.hotel) && `Hotel: ${text(raw.hotel)}`,
    text(raw.extraUpdate) && `Extra: ${text(raw.extraUpdate)}`,
  ].filter(Boolean);

  return {
    sheet,
    rowNumber,
    name,
    coApplicant: text(raw.coApplicant),
    phone,
    altPhone,
    email: text(raw.email),
    location: text(raw.location),
    consultant,
    saleDate,
    years: y,
    nightsPerYear: npy?.nights ?? null,
    daysPerYear: npy?.days ?? null,
    totalNights: total,
    productCost: cost,
    paidAmount: paid,
    // The method alone; the amount it was written beside is already in
    // paidAmount, and the raw sentence would make the method filter useless.
    paymentMode: paymentMethod(raw.paymentMode),
    pending: money(raw.pending),
    mafNo,
    ada: money(raw.ada),
    adaPaid: money(raw.adaPaid),
    offers: text(raw.offers),
    complimentaryNights: complimentaryNights(raw.offers),
    remarks: text(raw.remarks),
    stays,
    usageNotes: usageParts.length ? usageParts.join(' | ') : null,
    issues,
  };
}

/** A row can be committed when nothing about it is an outright error. */
export function isCommittable(row: MappedRow): boolean {
  return !row.issues.some((i) => i.severity === 'error');
}

/**
 * The plan a row describes, as a catalogue name.
 *
 * The sheet has no plan names, so one is composed from what it does record.
 * 821 rows collapse to 25 of these, which is the catalogue.
 */
export function planNameFor(years: number, nightsPerYear: number): string {
  const y = `${years} Year${years === 1 ? '' : 's'}`;
  return `${y} / ${nightsPerYear} Nights per year`;
}
