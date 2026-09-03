import { Role } from '@prisma/client';
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    name?: string;
    role?: Role;
    managerId?: string;
    isActive?: boolean;
}
