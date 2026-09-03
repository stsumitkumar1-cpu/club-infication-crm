"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const crypto = __importStar(require("crypto"));
const prisma_service_js_1 = require("../database/prisma.service.js");
const env_js_1 = require("../config/env.js");
const audit_service_js_1 = require("../audit/audit.service.js");
const BCRYPT_ROUNDS = 10;
let AuthService = class AuthService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        };
        const accessToken = jwt.sign(payload, env_js_1.env.jwt.accessSecret, {
            expiresIn: env_js_1.env.jwt.accessTtl,
        });
        const refreshToken = jwt.sign({ sub: user.id }, env_js_1.env.jwt.refreshSecret, {
            expiresIn: env_js_1.env.jwt.refreshTtl,
        });
        return { accessToken, refreshToken };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const tokens = this.generateTokens(user);
        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
    async refreshToken(token) {
        try {
            const decoded = jwt.verify(token, env_js_1.env.jwt.refreshSecret);
            const user = await this.prisma.user.findUnique({
                where: { id: String(decoded.sub) },
            });
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('User not found or deactivated');
            }
            return this.generateTokens(user);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async validateToken(token) {
        try {
            return jwt.verify(token, env_js_1.env.jwt.accessSecret);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        const message = 'If an account with that email exists, a reset link has been sent.';
        if (!user) {
            return { message };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry },
        });
        if (env_js_1.isProduction) {
            return { message };
        }
        return { message, devToken: resetToken };
    }
    async resetPassword(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: dto.token,
                resetTokenExpiry: { gt: new Date() },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        return { message: 'Password successfully reset' };
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                passwordHash: true,
                isActive: true,
            },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Your account is no longer active');
        }
        if (user.role !== client_1.Role.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only a Super Admin can change passwords. Ask a Super Admin to set a new one for you.');
        }
        const currentValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!currentValid) {
            throw new common_1.UnauthorizedException('Your current password is incorrect');
        }
        const unchanged = await bcrypt.compare(dto.newPassword, user.passwordHash);
        if (unchanged) {
            throw new common_1.BadRequestException('The new password is the same as your current one');
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
        await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: user.id },
                data: {
                    passwordHash,
                    resetToken: null,
                    resetTokenExpiry: null,
                },
            });
            await this.audit.withinTransaction(tx, {
                actorId: user.id,
                action: 'PASSWORD_CHANGE',
                entity: 'User',
                entityId: user.id,
                metadata: { email: user.email, self: true },
            });
        });
        return { message: 'Password changed successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        audit_service_js_1.AuditService])
], AuthService);
//# sourceMappingURL=auth.service.js.map