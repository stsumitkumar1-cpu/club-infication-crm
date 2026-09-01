import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service.js';
import { env, isProduction } from '../config/env.js';
import {
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/index.js';
import { AuditService } from '../audit/audit.service.js';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  private generateTokens(user: {
    id: string;
    email: string;
    role: string;
    name: string;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, env.jwt.accessSecret, {
      expiresIn: env.jwt.accessTtl as jwt.SignOptions['expiresIn'],
    });
    const refreshToken = jwt.sign({ sub: user.id }, env.jwt.refreshSecret, {
      expiresIn: env.jwt.refreshTtl as jwt.SignOptions['expiresIn'],
    });

    return { accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
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

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, env.jwt.refreshSecret) as jwt.JwtPayload;

      const user = await this.prisma.user.findUnique({
        where: { id: String(decoded.sub) },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or deactivated');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async validateToken(token: string) {
    try {
      return jwt.verify(token, env.jwt.accessSecret);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Always return the same message so the endpoint cannot be used to
    // enumerate which email addresses have accounts.
    const message =
      'If an account with that email exists, a reset link has been sent.';

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

    if (isProduction) {
      // Returning the token would hand any caller a password reset for any
      // address, so outside development it never leaves the server.
      // TODO(Phase 10): deliver this by email (Spec 14).
      return { message };
    }

    return { message, devToken: resetToken };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: dto.token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
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

  /**
   * Password change by the account's own owner.
   *
   * Distinct from resetPassword, which trusts an emailed token, and from the
   * Super Admin's PATCH /users/:id, which trusts the caller's role. Here the
   * proof is the current password — so a signed-in session that has been walked
   * away from cannot be used to take the account over.
   */
  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
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

    // The token names a user who no longer exists or has been deactivated.
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Your account is no longer active');
    }

    /*
     * Only a Super Admin manages credentials (client rule). Managers and
     * Executives do not set their own password — a Super Admin sets it for them.
     *
     * Enforced here and not only by hiding the form. A hidden form is a hint;
     * this endpoint is reachable with nothing but a valid token and curl, so the
     * rule has to live where the write happens.
     */
    if (user.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException(
        'Only a Super Admin can change passwords. Ask a Super Admin to set a new one for you.',
      );
    }

    const currentValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!currentValid) {
      throw new UnauthorizedException('Your current password is incorrect');
    }

    /*
     * Refusing a no-op change is not pedantry: silently "succeeding" would tell
     * the user their password had been rotated when it had not, which is exactly
     * the wrong thing to believe after a suspected compromise.
     */
    const unchanged = await bcrypt.compare(dto.newPassword, user.passwordHash);
    if (unchanged) {
      throw new BadRequestException(
        'The new password is the same as your current one',
      );
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          // Any outstanding reset link is void once the owner sets a password
          // themselves — otherwise an old emailed token could undo this.
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      await this.audit.withinTransaction(tx, {
        actorId: user.id,
        action: 'PASSWORD_CHANGE',
        entity: 'User',
        entityId: user.id,
        // Never the password, old or new: an audit row is readable by design.
        metadata: { email: user.email, self: true },
      });
    });

    return { message: 'Password changed successfully' };
  }
}
