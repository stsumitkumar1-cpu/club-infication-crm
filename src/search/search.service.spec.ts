// Nest 12 is ESM, so the runner runs in ESM mode where `jest` is not a global.
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { Test } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { SearchService } from './search.service.js';
import { PrismaService } from '../database/prisma.service.js';
import type { AuthUser } from '../common/types/index.js';

type AnyMock = Mock<(...args: any[]) => any>;
const mockFn = (): AnyMock => jest.fn<(...args: any[]) => any>();

const SUPER_ADMIN: AuthUser = {
  sub: 'admin-1',
  email: 'admin@clubinfication.com',
  name: 'Super Admin',
  role: Role.SUPER_ADMIN,
};
const MANAGER: AuthUser = {
  sub: 'manager-1',
  email: 'm1@clubinfication.com',
  name: 'Manager One',
  role: Role.MANAGER,
};
const EXECUTIVE: AuthUser = {
  sub: 'exec-1',
  email: 'e1@clubinfication.com',
  name: 'Executive One',
  role: Role.EXECUTIVE,
};

describe('SearchService (global search — Spec 11)', () => {
  let service: SearchService;
  let prisma: {
    customer: { findMany: AnyMock; count: AnyMock };
    user: { findMany: AnyMock; count: AnyMock };
    package: { findMany: AnyMock; count: AnyMock };
  };

  beforeEach(async () => {
    prisma = {
      customer: {
        findMany: mockFn().mockResolvedValue([]),
        count: mockFn().mockResolvedValue(0),
      },
      user: {
        findMany: mockFn().mockResolvedValue([]),
        count: mockFn().mockResolvedValue(0),
      },
      package: {
        findMany: mockFn().mockResolvedValue([]),
        count: mockFn().mockResolvedValue(0),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = moduleRef.get(SearchService);
  });

  describe('term handling', () => {
    it('returns nothing for a single character without querying at all', async () => {
      const res = await service.searchAll({ q: 'a' }, SUPER_ADMIN);

      expect(res).toEqual({ query: 'a', total: 0, groups: [] });
      // The cheap guard has to come before the queries, or every keystroke of
      // a long word costs six round trips against unselective terms.
      expect(prisma.customer.findMany).not.toHaveBeenCalled();
      expect(prisma.user.findMany).not.toHaveBeenCalled();
      expect(prisma.package.findMany).not.toHaveBeenCalled();
    });

    it('trims before measuring, so whitespace is not a search', async () => {
      const res = await service.searchAll({ q: '   ' }, SUPER_ADMIN);
      expect(res.groups).toEqual([]);
      expect(prisma.customer.findMany).not.toHaveBeenCalled();
    });

    it('searches once the term is long enough', async () => {
      await service.searchAll({ q: 'jo' }, SUPER_ADMIN);
      expect(prisma.customer.findMany).toHaveBeenCalled();
    });

    it('drops groups that matched nothing rather than showing empty headings', async () => {
      prisma.customer.findMany.mockResolvedValue([
        { id: 'c1', name: 'John', phone: '999', plan: 'Silver', status: 'ACTIVE', membershipId: null },
      ]);
      prisma.customer.count.mockResolvedValue(1);

      const res = await service.searchAll({ q: 'john' }, SUPER_ADMIN);

      expect(res.groups.map((g) => g.type)).toEqual(['customer']);
    });
  });

  /*
   * The security-critical half. Scope must be AND-ed into the query, never
   * applied after the fetch: a search box is the easiest place in a CRM to
   * enumerate records you were never meant to see.
   */
  describe('scope is folded into the query (Spec 2.3)', () => {
    const customerWhere = () => prisma.customer.findMany.mock.calls[0][0].where;
    const userWhere = () => prisma.user.findMany.mock.calls[0][0].where;

    it('gives a Super Admin an unrestricted customer scope', async () => {
      await service.searchAll({ q: 'jo' }, SUPER_ADMIN);
      expect(customerWhere().AND[0]).toEqual({});
    });

    it("restricts a Manager's customers to their own team", async () => {
      await service.searchAll({ q: 'jo' }, MANAGER);
      expect(customerWhere().AND[0]).toEqual({
        OR: [
          { assignedExec: { managerId: 'manager-1' } },
          { assignedExecId: 'manager-1' },
        ],
      });
    });

    it("restricts an Executive's customers to their own records", async () => {
      await service.searchAll({ q: 'jo' }, EXECUTIVE);
      expect(customerWhere().AND[0]).toEqual({ assignedExecId: 'exec-1' });
    });

    it('lets an Executive find only themselves among people', async () => {
      await service.searchAll({ q: 'jo' }, EXECUTIVE);
      expect(userWhere().AND[0]).toEqual({ id: 'exec-1' });
    });

    it("limits a Manager's people to their own team plus themselves", async () => {
      await service.searchAll({ q: 'jo' }, MANAGER);
      expect(userWhere().AND[0]).toEqual({
        OR: [{ managerId: 'manager-1' }, { id: 'manager-1' }],
      });
    });

    it('counts within the same scope it searched, so totals cannot leak either', async () => {
      await service.searchAll({ q: 'jo' }, EXECUTIVE);

      expect(prisma.customer.count.mock.calls[0][0].where).toEqual(
        prisma.customer.findMany.mock.calls[0][0].where,
      );
    });
  });

  describe('what a customer row matches', () => {
    it('covers the Spec 11 criteria, case-insensitively', async () => {
      await service.searchAll({ q: 'CI-2026' }, SUPER_ADMIN);

      const or = prisma.customer.findMany.mock.calls[0][0].where.AND[1].OR;
      const fields = or.map((clause: any) => Object.keys(clause)[0]);
      expect(fields).toEqual(['name', 'phone', 'email', 'membershipId', 'plan']);
      for (const clause of or) {
        expect(Object.values(clause)[0]).toMatchObject({ mode: 'insensitive' });
      }
    });
  });

  describe('result shape', () => {
    it('reports the in-scope total even when the page is capped', async () => {
      prisma.customer.findMany.mockResolvedValue([
        { id: 'c1', name: 'John', phone: '999', plan: 'Silver', status: 'ACTIVE', membershipId: 'CI-1' },
      ]);
      prisma.customer.count.mockResolvedValue(42);

      const res = await service.searchAll({ q: 'jo', limit: 1 }, SUPER_ADMIN);
      const group = res.groups[0];

      expect(group.items).toHaveLength(1);
      expect(group.total).toBe(42);
      expect(prisma.customer.findMany.mock.calls[0][0].take).toBe(1);
    });

    it('builds a subtitle from whatever identifies the customer, skipping blanks', async () => {
      prisma.customer.findMany.mockResolvedValue([
        { id: 'c1', name: 'John', phone: '9990001111', plan: 'Silver', status: 'ACTIVE', membershipId: null },
      ]);
      prisma.customer.count.mockResolvedValue(1);

      const res = await service.searchAll({ q: 'jo' }, SUPER_ADMIN);

      expect(res.groups[0].items[0].subtitle).toBe('9990001111 · Silver');
    });

    it('flags an inactive person rather than hiding them', async () => {
      prisma.user.findMany.mockResolvedValue([
        { id: 'u1', name: 'Old Exec', email: 'o@x.com', role: Role.EXECUTIVE, isActive: false },
      ]);
      prisma.user.count.mockResolvedValue(1);

      const res = await service.searchAll({ q: 'old' }, SUPER_ADMIN);

      expect(res.groups[0].items[0].badge).toBe('EXECUTIVE · inactive');
    });

    it('describes a plan in nights, never in a day budget', async () => {
      prisma.package.findMany.mockResolvedValue([
        { id: 'p1', name: 'Silver', price: 100000, nights: 9, isActive: true },
      ]);
      prisma.package.count.mockResolvedValue(1);

      const res = await service.searchAll({ q: 'sil' }, SUPER_ADMIN);

      expect(res.groups[0].items[0].subtitle).toBe('₹1,00,000 · 9 nights');
    });

    it('sums the group totals, not the capped page lengths', async () => {
      prisma.customer.findMany.mockResolvedValue([
        { id: 'c1', name: 'John', phone: '999', plan: 'Silver', status: 'ACTIVE', membershipId: null },
      ]);
      prisma.customer.count.mockResolvedValue(10);
      prisma.package.findMany.mockResolvedValue([
        { id: 'p1', name: 'Johnson Gold', price: 1, nights: 1, isActive: true },
      ]);
      prisma.package.count.mockResolvedValue(3);

      const res = await service.searchAll({ q: 'jo' }, SUPER_ADMIN);

      expect(res.total).toBe(13);
    });
  });
});
