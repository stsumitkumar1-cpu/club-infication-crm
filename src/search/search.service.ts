import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import {
  assignableUserFilter,
  customerScopeFilter,
} from '../common/scope/index.js';
import type { AuthUser } from '../common/types/index.js';
import { QuerySearchDto } from './dto/index.js';

/**
 * One hit, in the shape the search box renders. Deliberately no URL: the route
 * table belongs to the frontend, so the API says *what* was found and the UI
 * decides where that lives.
 */
export interface SearchHit {
  id: string;
  title: string;
  subtitle: string | null;
  badge: string | null;
}

export interface SearchGroup {
  type: 'customer' | 'user' | 'plan';
  label: string;
  /** Total matches in scope, which may exceed `items.length`. */
  total: number;
  items: SearchHit[];
}

/** Below this a term matches most of the database, so it is not a search. */
const MIN_TERM_LENGTH = 2;
const DEFAULT_LIMIT = 5;

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  /**
   * Global search — Master Spec 11 lists the customer criteria (name, phone,
   * email, membership ID, plan); people and plans are included because the
   * header box says "search anything" and a Manager looking for an Executive
   * has nowhere else to type.
   *
   * Every branch is scoped inside its own query via the shared scope filters
   * (Spec 2.3). Nothing here post-filters a fetched list, so a customer outside
   * the caller's team is not merely hidden from the results — it is never read.
   */
  async searchAll(query: QuerySearchDto, currentUser: AuthUser) {
    const term = query.q.trim();
    const limit = query.limit ?? DEFAULT_LIMIT;

    if (term.length < MIN_TERM_LENGTH) {
      return { query: term, total: 0, groups: [] as SearchGroup[] };
    }

    const [customers, users, plans] = await Promise.all([
      this.searchCustomers(term, limit, currentUser),
      this.searchUsers(term, limit, currentUser),
      this.searchPlans(term, limit),
    ]);

    const groups = [customers, users, plans].filter((g) => g.items.length > 0);

    return {
      query: term,
      total: groups.reduce((sum, g) => sum + g.total, 0),
      groups,
    };
  }

  private async searchCustomers(
    term: string,
    limit: number,
    currentUser: AuthUser,
  ): Promise<SearchGroup> {
    const contains = { contains: term, mode: 'insensitive' as const };

    const where: Prisma.CustomerWhereInput = {
      AND: [
        customerScopeFilter(currentUser),
        {
          OR: [
            { name: contains },
            { phone: contains },
            { email: contains },
            { membershipId: contains },
            { plan: contains },
          ],
        },
      ],
    };

    const [rows, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          phone: true,
          plan: true,
          status: true,
          membershipId: true,
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      type: 'customer',
      label: 'Customers',
      total,
      items: rows.map((c) => ({
        id: c.id,
        title: c.name,
        // Whatever identifies this person fastest to someone scanning a list.
        subtitle: [c.phone, c.plan, c.membershipId].filter(Boolean).join(' · '),
        badge: c.status,
      })),
    };
  }

  /**
   * People. An Executive's filter resolves to themselves, so they can find
   * their own record and nobody else's — the same rule that governs who they
   * may assign a customer to.
   */
  private async searchUsers(
    term: string,
    limit: number,
    currentUser: AuthUser,
  ): Promise<SearchGroup> {
    const contains = { contains: term, mode: 'insensitive' as const };

    const where: Prisma.UserWhereInput = {
      AND: [
        assignableUserFilter(currentUser),
        { OR: [{ name: contains }, { email: contains }] },
      ],
    };

    const [rows, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        take: limit,
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      type: 'user',
      label: currentUser.role === Role.EXECUTIVE ? 'You' : 'People',
      total,
      items: rows.map((u) => ({
        id: u.id,
        title: u.name,
        subtitle: u.email,
        badge: u.isActive ? u.role : `${u.role} · inactive`,
      })),
    };
  }

  /** The plan catalog is company-wide, so there is no scope to apply. */
  private async searchPlans(term: string, limit: number): Promise<SearchGroup> {
    const where: Prisma.PackageWhereInput = {
      name: { contains: term, mode: 'insensitive' },
    };

    const [rows, total] = await Promise.all([
      this.prisma.package.findMany({
        where,
        take: limit,
        orderBy: { price: 'asc' },
        select: {
          id: true,
          name: true,
          price: true,
          nights: true,
          isActive: true,
        },
      }),
      this.prisma.package.count({ where }),
    ]);

    return {
      type: 'plan',
      label: 'Plans',
      total,
      items: rows.map((p) => ({
        id: p.id,
        title: p.name,
        // Nights only: days are derived from them, not sold separately.
        subtitle: `₹${p.price.toLocaleString('en-IN')} · ${p.nights} nights`,
        badge: p.isActive ? null : 'inactive',
      })),
    };
  }
}
