"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_METHODS = void 0;
exports.isBlank = isBlank;
exports.text = text;
exports.money = money;
exports.integer = integer;
exports.years = years;
exports.nightsPerYear = nightsPerYear;
exports.totalNights = totalNights;
exports.phones = phones;
exports.complimentaryNights = complimentaryNights;
exports.excelDate = excelDate;
exports.paymentMethod = paymentMethod;
exports.consultantKey = consultantKey;
exports.consultantFirstName = consultantFirstName;
exports.parseStays = parseStays;
exports.normaliseHeader = normaliseHeader;
exports.mapHeaderRow = mapHeaderRow;
exports.mapRow = mapRow;
exports.isCommittable = isCommittable;
exports.planNameFor = planNameFor;
const BLANKS = new Set(['', '-', 'nil', 'n/a', 'na', 'null', '--']);
function isBlank(value) {
    if (value === null || value === undefined)
        return true;
    return BLANKS.has(String(value).trim().toLowerCase());
}
function text(value) {
    if (isBlank(value))
        return null;
    return String(value).trim();
}
function money(value) {
    if (isBlank(value))
        return null;
    if (typeof value === 'number')
        return Number.isFinite(value) ? value : null;
    const digits = String(value).replace(/[^\d.]/g, '');
    if (!digits || digits === '.')
        return null;
    const n = Number.parseFloat(digits);
    return Number.isFinite(n) ? n : null;
}
function integer(value) {
    const n = money(value);
    return n === null ? null : Math.round(n);
}
function years(value) {
    if (isBlank(value))
        return null;
    const m = String(value).match(/(\d+)\s*years?/i);
    return m ? Number.parseInt(m[1], 10) : null;
}
function nightsPerYear(value) {
    if (isBlank(value))
        return null;
    const s = String(value);
    const nights = s.match(/(\d+)\s*N/i);
    if (!nights)
        return null;
    const days = s.match(/(\d+)\s*D/i);
    return {
        nights: Number.parseInt(nights[1], 10),
        days: days ? Number.parseInt(days[1], 10) : null,
    };
}
function totalNights(value) {
    return integer(value);
}
function phones(value) {
    if (isBlank(value))
        return { phone: null, altPhone: null };
    const parts = String(value)
        .split(/[\/,;|]| and |&/i)
        .map((p) => p.replace(/[^\d+]/g, '').trim())
        .filter((p) => p.length >= 4);
    return {
        phone: parts[0] ?? null,
        altPhone: parts.length > 1 ? parts.slice(1).join(' / ') : null,
    };
}
function complimentaryNights(value) {
    if (isBlank(value))
        return null;
    const s = String(value);
    const mentionsGift = /complimentar|complimentry|free\s*night|extra\s*night/i.test(s);
    if (!mentionsGift)
        return null;
    const m = s.match(/(\d+)\s*N\b/i);
    return m ? Number.parseInt(m[1], 10) : null;
}
function excelDate(value) {
    if (isBlank(value))
        return null;
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }
    if (typeof value === 'number' && value > 1 && value < 100000) {
        const ms = Math.round((value - 25569) * 86400 * 1000);
        const d = new Date(ms);
        return Number.isNaN(d.getTime()) ? null : d;
    }
    const s = String(value).trim();
    const dmy = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,5})$/);
    if (dmy) {
        let [, p1, p2, yy] = dmy;
        if (yy.startsWith('0202') && yy.length === 5) {
            yy = yy.substring(1);
        }
        const year = yy.length === 2 ? 2000 + Number(yy) : Number(yy);
        let dd = Number(p1);
        let mm = Number(p2);
        if (mm > 12 && dd <= 12) {
            const temp = dd;
            dd = mm;
            mm = temp;
        }
        const d = new Date(year, mm - 1, dd);
        return Number.isNaN(d.getTime()) ? null : d;
    }
    const missingHyphen = s.match(/^(\d{1,2})[-\/.](\d{1,2})(\d{4})$/);
    if (missingHyphen) {
        const [, dd, mm, yy] = missingHyphen;
        const year = Number(yy);
        const d = new Date(year, Number(mm) - 1, Number(dd));
        return Number.isNaN(d.getTime()) ? null : d;
    }
    const doubleZero = s.match(/^(\d{1,2})[-\/.](\d{1,2})0(\d{4})$/);
    if (doubleZero) {
        const [, dd, mm, yy] = doubleZero;
        const year = Number(yy);
        const d = new Date(year, Number(mm) - 1, Number(dd));
        return Number.isNaN(d.getTime()) ? null : d;
    }
    return null;
}
exports.PAYMENT_METHODS = [
    'Cash',
    'UPI',
    'Credit Card',
    'Debit Card',
    'Cheque',
    'Bank Transfer',
];
function paymentMethod(value) {
    const raw = text(value);
    if (!raw)
        return null;
    const s = raw.toLowerCase();
    const rules = [
        [/\bcredit\s*card\b|\bcc\b|creditcard|through\s*cc\b/, 'Credit Card'],
        [/\bdebit\s*card\b|\bdc\b|debitcard|through\s*dc\b/, 'Debit Card'],
        [/\bupi\b|g\.?\s*pay|gpay|google\s*pay|phone\s*pe|phonepe|paytm/, 'UPI'],
        [/\bcheque\b|\bcheck\b|\bdd\b|demand\s*draft/, 'Cheque'],
        [/bank\s*transfer|\bneft\b|\brtgs\b|\bimps\b|net\s*bank|online\s*transfer/, 'Bank Transfer'],
        [/\bcash\b/, 'Cash'],
        [/\bonline\b/, 'Bank Transfer'],
    ];
    for (const [pattern, method] of rules) {
        if (pattern.test(s))
            return method;
    }
    return raw;
}
function consultantKey(value) {
    const t = text(value);
    if (!t)
        return null;
    return t.toLowerCase().replace(/[^a-z0-9]/g, '');
}
function consultantFirstName(value) {
    const t = text(value);
    if (!t)
        return null;
    const first = t.trim().split(/\s+/)[0];
    return first ? first.toLowerCase().replace(/[^a-z0-9]/g, '') : null;
}
function stayNights(part) {
    if (isBlank(part))
        return null;
    const afterEquals = part.split('=').pop() ?? part;
    const m = afterEquals.match(/(\d+)\s*(?:nights?|n)\b/i);
    if (m)
        return Number.parseInt(m[1], 10);
    const bare = afterEquals.match(/(\d+)/);
    return bare ? Number.parseInt(bare[1], 10) : null;
}
function stayDates(part) {
    if (isBlank(part))
        return { checkIn: null, checkOut: null };
    const halves = String(part).split(/\s*to\s*/i);
    if (halves.length >= 2) {
        return {
            checkIn: excelDate(halves[0]),
            checkOut: excelDate(halves[halves.length - 1]),
        };
    }
    return { checkIn: excelDate(part), checkOut: null };
}
function parseStays(usedNights, dates, place, hotel) {
    if (isBlank(usedNights))
        return [];
    const split = (v) => isBlank(v) ? [] : String(v).split('/').map((s) => s.trim());
    const nightParts = split(usedNights);
    const dateParts = split(dates);
    const placeParts = split(place);
    const hotelParts = split(hotel);
    return nightParts.map((np, i) => {
        const nights = stayNights(np);
        const rawDates = dateParts[i] ?? null;
        const { checkIn, checkOut } = stayDates(rawDates ?? '');
        let confident = false;
        if (nights !== null && checkIn && checkOut && checkOut > checkIn) {
            const gap = Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000);
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
const HEADER_MAP = {
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
function normaliseHeader(header) {
    const t = text(header);
    if (!t)
        return null;
    const key = t.toLowerCase().replace(/[^a-z0-9]/g, '');
    return HEADER_MAP[key] ?? null;
}
function mapHeaderRow(headers) {
    const first = headers.map((h) => normaliseHeader(h));
    const usedNightsAt = first.findIndex((f) => f === 'usedNights');
    const fields = new Array(headers.length).fill(null);
    const taken = new Map();
    const duplicates = [];
    first.forEach((field, col) => {
        if (!field)
            return;
        if (!taken.has(field)) {
            taken.set(field, col);
            fields[col] = field;
            return;
        }
        if (field === 'saleDate' &&
            usedNightsAt !== -1 &&
            col > usedNightsAt &&
            !taken.has('stayDates')) {
            taken.set('stayDates', col);
            fields[col] = 'stayDates';
            return;
        }
        duplicates.push(`column ${col} repeats "${String(headers[col])}" (already at column ${taken.get(field)})`);
    });
    return { fields, duplicates };
}
function mapRow(sheet, rowNumber, raw) {
    const issues = [];
    const add = (field, severity, message) => issues.push({ field, severity, message });
    const name = text(raw.name);
    if (!name)
        add('name', 'error', 'No customer name, so there is nothing to import');
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
        add('totalNights', 'warning', `${npy.nights} nights x ${y} years is ${y * npy.nights}, but the sheet says ${total}`);
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
        add('usedNights', 'warning', `${unreadable.length} of ${stays.length} stay(s) could not be read reliably and will be kept as notes`);
    }
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
function isCommittable(row) {
    return !row.issues.some((i) => i.severity === 'error');
}
function planNameFor(years, nightsPerYear) {
    const y = `${years} Year${years === 1 ? '' : 's'}`;
    return `${y} / ${nightsPerYear} Nights per year`;
}
//# sourceMappingURL=sheet-parser.js.map