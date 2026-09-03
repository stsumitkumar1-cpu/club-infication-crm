import { Role } from '@prisma/client';
export declare class QueryUsersDto {
    search?: string;
    role?: Role;
    isActive?: boolean;
    page?: number;
    limit?: number;
}
