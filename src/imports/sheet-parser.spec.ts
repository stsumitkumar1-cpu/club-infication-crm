import {
  complimentaryNights,
  consultantKey,
  excelDate,
  isBlank,
  isCommittable,
  mapHeaderRow,
  mapRow,
  money,
  nightsPerYear,
  parseStays,
  paymentMethod,
  phones,
  planNameFor,
  years,
} from './sheet-parser.js';

/*
 * Every fixture below is a real value copied out of the client's workbook. The
 * parser is the whole risk in the import: it is the only place that decides what
 * 822 hand-written rows mean, and a wrong reading becomes a wrong balance the
 * ledger will then treat as fact.
 */
describe('legacy sheet parser', () => {
  describe('blanks', () => {
    it('treats the sheet\'s several ways of writing nothing as nothing', () => {
      // "Nil" alone appears in 605 rows of the Pending column.
      for (const v of ['', ' ', '-', 'Nil', 'nil', 'NIL', '--', 'N/A', null, undefined]) {
        expect(isBlank(v)).toBe(true);
      }
    });

    it('does not treat a zero as blank', () => {
      expect(isBlank(0)).toBe(false);
      expect(isBlank('0')).toBe(false);
    });
  });

  describe('money', () => {
    it('reads Indian grouping', () => {
      expect(money('1,25,000')).toBe(125000);
      expect(money('2,40,000')).toBe(240000);
      expect(money('42,500')).toBe(42500);
    });

    it('reads a plain number and a numeric cell', () => {
      expect(money('165000')).toBe(165000);
      expect(money(90000)).toBe(90000);
    });

    /*
     * One Paid Amt cell contains the word "vu". Reading it as 0 would record a
     * payment of nothing and silently overstate what is still owed; null makes
     * it a row for a human to look at.
     */
    it('returns null for text with no digits, not zero', () => {
      expect(money('vu')).toBeNull();
      expect(money('Nil')).toBeNull();
    });
  });

  describe('years — the "Product" column is a validity, not a plan name', () => {
    it('reads every spelling in the sheet', () => {
      expect(years('03Years')).toBe(3);
      expect(years('05years')).toBe(5);
      expect(years('05 years')).toBe(5);
      expect(years('01Year')).toBe(1);
      expect(years('10Years')).toBe(10);
    });

    it('returns null when there is no validity to read', () => {
      expect(years('Bronze')).toBeNull();
      expect(years('')).toBeNull();
    });
  });

  describe('nightsPerYear', () => {
    it('splits "06N/07Days" into its two figures', () => {
      expect(nightsPerYear('06N/07Days')).toEqual({ nights: 6, days: 7 });
      expect(nightsPerYear('04N/05days')).toEqual({ nights: 4, days: 5 });
      expect(nightsPerYear('02N/03D')).toEqual({ nights: 2, days: 3 });
    });

    /*
     * Reported as written rather than corrected. One row says "04N/06Days",
     * where days is not nights + 1 — that is data to check, not a typo to
     * quietly fix on the client's behalf.
     */
    it('reports the days the sheet wrote, even when they look wrong', () => {
      expect(nightsPerYear('04N/06Days')).toEqual({ nights: 4, days: 6 });
    });

    it('returns null when there is no night count', () => {
      expect(nightsPerYear('-')).toBeNull();
      expect(nightsPerYear('yearly')).toBeNull();
    });
  });

  describe('phones', () => {
    it('splits two numbers in one cell, first as the main contact', () => {
      expect(phones('9813622308/951802113')).toEqual({
        phone: '9813622308',
        altPhone: '951802113',
      });
    });

    it('keeps a single number as it is', () => {
      expect(phones('8291531318')).toEqual({
        phone: '8291531318',
        altPhone: null,
      });
    });

    /*
     * No length check. A 9- or 11-digit number is still the number the team
     * has, and refusing it would lose a real customer over a typo.
     */
    it('accepts a number of the wrong length rather than dropping it', () => {
      expect(phones('951802113').phone).toBe('951802113');
    });

    it('reports a missing number as missing', () => {
      expect(phones('-')).toEqual({ phone: null, altPhone: null });
    });
  });

  describe('complimentaryNights', () => {
    it('reads the free nights out of an offer', () => {
      expect(complimentaryNights('02N/03D Complimentary')).toBe(2);
      expect(complimentaryNights('01N/02D Complimentary')).toBe(1);
    });

    /*
     * An offer that grants no nights must grant no nights. "01N,RCV-1500" has a
     * night count but says nothing about it being complimentary, so reading it
     * as free entitlement would hand out nights nobody sold.
     */
    it('grants nothing when the offer is not nights', () => {
      expect(complimentaryNights('Food Voucher of INR3000/-')).toBeNull();
      expect(complimentaryNights('No Gift Charge')).toBeNull();
      expect(complimentaryNights('01N,RCV-1500,ATV-1500')).toBeNull();
    });

    it('reads it whichever way round the wording is', () => {
      expect(complimentaryNights('Complimentary 02N')).toBe(2);
    });
  });

  /*
   * The sheet's "Mode Of Payment" mixes the amount, the method and sometimes the
   * bank into one sentence. Only the method belongs in the CRM's method field —
   * the amount is already recorded, and storing the sentence would make the
   * filter useless.
   */
  describe('paymentMethod', () => {
    it('pulls the method out of the sheet own wording', () => {
      expect(paymentMethod('5000 Paid Through UPI')).toBe('UPI');
      expect(paymentMethod('40000 Paid Through CC')).toBe('Credit Card');
      // A real cell: the space between "through" and "CC" is missing, so a
      // word boundary alone would not find it.
      expect(paymentMethod('90,000 paid throughCC')).toBe('Credit Card');
      expect(paymentMethod('Paid 5000 from G.Pay')).toBe('UPI');
      expect(paymentMethod('20,000 Paid through Credit Card')).toBe('Credit Card');
      expect(paymentMethod('Online')).toBe('Bank Transfer');
    });

    /*
     * Order matters. A bare "cc" must not catch a debit-card payment, and
     * "card" alone must not decide between the two.
     */
    it('does not confuse a debit card with a credit card', () => {
      expect(paymentMethod('12,500 Paid through DC')).toBe('Debit Card');
      expect(paymentMethod('paid through debit card')).toBe('Debit Card');
    });

    /*
     * An unrecognised method is still what the team wrote down. Returning null
     * would lose the only record of how the money arrived.
     */
    it('keeps the original text when it recognises nothing', () => {
      expect(paymentMethod('Adjusted against old booking')).toBe(
        'Adjusted against old booking',
      );
    });

    it('reports a blank cell as blank', () => {
      expect(paymentMethod('Nil')).toBeNull();
      expect(paymentMethod('-')).toBeNull();
    });
  });

  describe('excelDate', () => {
    it('passes a real date cell through', () => {
      const d = new Date('2026-08-03T00:00:00.000Z');
      expect(excelDate(d)).toBe(d);
    });

    it('converts a 1900-system serial', () => {
      /*
       * Anchored on two verified points rather than a guess: 44927 is
       * 2023-01-01 in Excel's 1900 system, and 46237 is the serial the client's
       * August 2026 tab carries against a row dated 03 Aug 2026.
       */
      expect(excelDate(44927)?.toISOString().slice(0, 10)).toBe('2023-01-01');
      expect(excelDate(46237)?.toISOString().slice(0, 10)).toBe('2026-08-03');
    });

    it('reads a hand-typed day-first date', () => {
      const out = excelDate('05-07-2024');
      expect(out?.getFullYear()).toBe(2024);
      expect(out?.getMonth()).toBe(6); // July, so day-first not month-first
      expect(out?.getDate()).toBe(5);
    });

    it('returns null for a note written where a date belongs', () => {
      // A real cell from the sheet's Dates column.
      expect(excelDate('Siya was not here')).toBeNull();
    });
  });

  describe('consultantKey — 39 spellings, about 20 people', () => {
    it('collapses case and punctuation', () => {
      expect(consultantKey('Vikramjit Singh')).toBe(
        consultantKey('Vikramjit singh'),
      );
      expect(consultantKey('Zoya Sheikh')).toBe(consultantKey('zoya sheikh'));
      expect(consultantKey('Vijay Kumar')).toBe(consultantKey('Vijay kumar'));
    });

    /*
     * Left apart on purpose. "Sekhon" and "Sheikh" are different surnames, and
     * merging them would silently reassign someone else's sales. They surface
     * for a human to confirm instead.
     */
    it('does not merge genuinely different spellings', () => {
      expect(consultantKey('Zoya Sheikh')).not.toBe(
        consultantKey('Zoya Sekhon'),
      );
      expect(consultantKey('Ankit Rathore')).not.toBe(consultantKey('Ankit'));
    });
  });

  /*
   * The hardest column in the workbook: 337 stays packed into 203 rows as four
   * parallel slash-separated lists that do not reliably line up.
   */
  describe('parseStays', () => {
    it('unpacks several stays from one row', () => {
      const stays = parseStays(
        '02Night/01Night/01Night',
        '17-07-2024 to 18-07-2024/07-03-2025 to 08-03-2025/08-03-2025 to 09-03-2025',
        'Ludhiana/D.shala/Mechlodganj',
        'KG Hotel/Stone wood/DlS Resort',
      );

      expect(stays).toHaveLength(3);
      expect(stays[1]).toMatchObject({
        nights: 1,
        place: 'D.shala',
        hotel: 'Stone wood',
        confident: true,
      });
    });

    /*
     * The row that makes blind pairing unsafe: the first "date" is a note, so
     * position 1 has a night count and no dates. It must be reported as not
     * confident rather than paired with the next stay's dates.
     */
    it('marks a stay unreadable when its date is a note, not a date', () => {
      const stays = parseStays(
        '02Night/01Night',
        'Siya was not here/ 17-07-2024 to 18-07-2024',
        'Chandigarh/Ludhiana',
        'Chandigarh/KG Hotel',
      );

      expect(stays[0].confident).toBe(false);
      expect(stays[0].rawDates).toBe('Siya was not here');
      expect(stays[1].confident).toBe(true);
    });

    /*
     * One row reads "09-04-2025to12-04-2024" — the end date is a year before
     * the start. Turning that into a booking would produce a negative stay.
     */
    it('refuses a range whose end is before its start', () => {
      const stays = parseStays(
        '03Nights',
        '09-04-2025to12-04-2024',
        'Srinagar',
        'Clam Inn',
      );

      expect(stays[0].confident).toBe(false);
    });

    it('reads the total out of a rooms-times-nights equation', () => {
      const stays = parseStays(
        '02Rooms for 02Nights=04Nights',
        '05-07-2024 to 07-07-2024',
        'Dharamshala',
        'Portal Hotel',
      );

      // The team's own total after the "=", not a recomputation.
      expect(stays[0].nights).toBe(4);
      // 4 nights against a 2-night range does not add up, so not confident.
      expect(stays[0].confident).toBe(false);
    });

    it('is confident only when the nights match the date gap', () => {
      const good = parseStays('03Nights', '09-04-2025 to 12-04-2025', 'x', 'y');
      expect(good[0].confident).toBe(true);

      const mismatched = parseStays(
        '05Nights',
        '09-04-2025 to 12-04-2025',
        'x',
        'y',
      );
      expect(mismatched[0].confident).toBe(false);
    });

    it('returns nothing when the row records no usage', () => {
      expect(parseStays('-', '-', '-', '-')).toEqual([]);
      expect(parseStays(null, null, null, null)).toEqual([]);
    });
  });

  /*
   * Several tabs head three different columns "Date": the sale date, an EMI
   * date, and the stay date. Mapping cell by cell let the last win, and 312 of
   * 822 rows lost their sale date — which would have dated every membership to
   * today and put all of them in year 1.
   */
  describe('mapHeaderRow', () => {
    it('keeps the first column that claims a field', () => {
      const { fields } = mapHeaderRow([
        undefined,
        'Date',
        'Name',
        'Phone No.',
        'Product',
        'Product Cost',
        'Nights Per Year',
        'DATE ',
      ]);

      expect(fields[1]).toBe('saleDate');
      // The later "DATE" is an EMI date, not the sale date.
      expect(fields[7]).toBeNull();
    });

    it('reads a second "Date" inside the usage block as the stay date', () => {
      const { fields } = mapHeaderRow([
        undefined,
        'Date',
        'Name',
        'Phone No.',
        'Product',
        'Product Cost',
        'Used Nights',
        'Date',
        'Place',
      ]);

      expect(fields[1]).toBe('saleDate');
      // Two tabs head the stay date column "Date" rather than "Dates".
      expect(fields[7]).toBe('stayDates');
    });

    it('reports the headings it ignored', () => {
      const { duplicates } = mapHeaderRow([
        undefined,
        'Date',
        'Name',
        'Phone No.',
        'Product',
        'Product Cost',
        'DATE ',
      ]);

      expect(duplicates).toHaveLength(1);
      expect(duplicates[0]).toMatch(/repeats/);
    });

    it('maps the renamed and misspelled columns to one field', () => {
      const a = mapHeaderRow([undefined, 'ADA(Annual Divided Cost)']).fields[1];
      const b = mapHeaderRow([undefined, 'ADA']).fields[1];
      const c = mapHeaderRow([undefined, 'Sr.No']).fields[1];
      const d = mapHeaderRow([undefined, 'S.No']).fields[1];
      const e = mapHeaderRow([undefined, 'Hotels']).fields[1];
      const f = mapHeaderRow([undefined, 'Hotel']).fields[1];

      expect(a).toBe('ada');
      expect(b).toBe('ada');
      expect(c).toBe('serial');
      expect(d).toBe('serial');
      expect(e).toBe('hotel');
      expect(f).toBe('hotel');
    });
  });

  describe('mapRow', () => {
    /** The first row of the August 2026 tab, verbatim. */
    const rajRattan = {
      saleDate: new Date('2026-08-03T00:00:00.000Z'),
      name: 'Raj Rattan',
      coApplicant: 'Usha',
      phone: '8291531318',
      email: 'aroma.grenery@gmail.com',
      consultant: 'Pawan Kumar',
      location: 'Mohali',
      product: '05Years',
      productCost: '165000',
      paidAmount: '5000',
      paymentMode: '5000 Paid Through UPI',
      pending: '160000',
      mafNo: '140951',
      ada: 'Nil',
      nightsPerYear: '06N/07Days',
      totalNights: '30Nights',
      offers: 'Nil',
    };

    it('reads a clean row with no errors', () => {
      const row = mapRow('August2026', 2, rajRattan);

      expect(row).toMatchObject({
        name: 'Raj Rattan',
        coApplicant: 'Usha',
        phone: '8291531318',
        altPhone: null,
        location: 'Mohali',
        consultant: 'Pawan Kumar',
        years: 5,
        nightsPerYear: 6,
        daysPerYear: 7,
        totalNights: 30,
        productCost: 165000,
        paidAmount: 5000,
        mafNo: '140951',
        ada: null,
        complimentaryNights: null,
      });
      expect(isCommittable(row)).toBe(true);
    });

    it('blocks a row with no name — there is nothing to import', () => {
      const row = mapRow('July2024', 20, { ...rajRattan, name: null });
      expect(isCommittable(row)).toBe(false);
      expect(row.issues).toContainEqual(
        expect.objectContaining({ field: 'name', severity: 'error' }),
      );
    });

    it('blocks a row whose nights per year cannot be read', () => {
      const row = mapRow('Dec2024', 41, { ...rajRattan, nightsPerYear: '' });
      expect(isCommittable(row)).toBe(false);
    });

    /*
     * Imported anyway, per the client: bring the sheet in as it stands and let
     * a Manager or Super Admin correct it in the CRM.
     */
    it('imports a row with a missing MAF number, flagged', () => {
      const row = mapRow('Aug2026', 5, { ...rajRattan, mafNo: '' });

      expect(isCommittable(row)).toBe(true);
      expect(row.issues).toContainEqual(
        expect.objectContaining({ field: 'mafNo', severity: 'warning' }),
      );
    });

    it('imports a row with no phone number, flagged', () => {
      const row = mapRow('Aug2026', 5, { ...rajRattan, phone: '-' });

      expect(isCommittable(row)).toBe(true);
      expect(row.phone).toBeNull();
      expect(row.issues).toContainEqual(
        expect.objectContaining({ field: 'phone', severity: 'warning' }),
      );
    });

    it('flags a total-nights figure that does not match the arithmetic', () => {
      // Oct2024 r27 in the real sheet: 5 years x 4 nights should be 20.
      const row = mapRow('Oct2024', 27, {
        ...rajRattan,
        product: '05Years',
        nightsPerYear: '04N/05Days',
        totalNights: '12Nights',
      });

      expect(isCommittable(row)).toBe(true);
      expect(row.issues).toContainEqual(
        expect.objectContaining({ field: 'totalNights', severity: 'warning' }),
      );
    });

    it('keeps every stay column verbatim, even the ones it could read', () => {
      const row = mapRow('May2024', 7, {
        ...rajRattan,
        usedNights: '02Night/01Night',
        stayDates: 'Siya was not here/ 17-07-2024 to 18-07-2024',
        place: 'Chandigarh/Ludhiana',
        hotel: 'Chandigarh/KG Hotel',
      });

      // The original wording is the only way back if a booking turns out wrong.
      expect(row.usageNotes).toContain('Used Nights: 02Night/01Night');
      expect(row.usageNotes).toContain('Siya was not here');
      expect(row.stays).toHaveLength(2);
    });

    it('reads complimentary nights out of the offers column', () => {
      const row = mapRow('Aug2026', 4, {
        ...rajRattan,
        offers: '02N,RCV-1500,ATV-1500,02Years Extension',
      });
      // No mention of a complimentary night, so no free entitlement.
      expect(row.complimentaryNights).toBeNull();

      const gifted = mapRow('Aug2026', 4, {
        ...rajRattan,
        offers: '02N/03D Complimentary',
      });
      expect(gifted.complimentaryNights).toBe(2);
    });
  });

  describe('planNameFor', () => {
    it('composes a catalogue name from what the sheet does record', () => {
      expect(planNameFor(5, 6)).toBe('5 Years / 6 Nights per year');
      expect(planNameFor(1, 4)).toBe('1 Year / 4 Nights per year');
    });
  });
});
