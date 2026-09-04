import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../database/prisma.service.js';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from './dto/index.js';
import { AuditService } from '../audit/audit.service.js';
export declare class AuthService {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    private generateTokens;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    validateToken(token: string): Promise<string | jwt.JwtPayload>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
        devToken?: undefined;
    } | {
        message: string;
        devToken: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
