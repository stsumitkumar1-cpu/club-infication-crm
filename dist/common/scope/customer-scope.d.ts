import { Prisma } from '@prisma/client';
import type { AuthUser } from '../types/index.js';
export declare function customerScopeFilter(user: AuthUser): Prisma.CustomerWhereInput;
export declare function membershipScopeFilter(user: AuthUser): Prisma.MembershipWhereInput;
export declare function assignableUserFilter(user: AuthUser): Prisma.UserWhereInput;
