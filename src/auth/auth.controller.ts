import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import {
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/index.js';
import { JwtAuthGuard } from '../common/guards/index.js';
import { CurrentUser, RateLimit } from '../common/decorators/index.js';
import type { AuthUser } from '../common/types/index.js';

/**
 * Authentication — Master Spec 16 requires rate limiting here specifically.
 *
 * Without it, an attacker can guess passwords as fast as the network allows,
 * and each attempt also burns ~100ms of server CPU on bcrypt, which makes
 * unlimited attempts a cheap denial-of-service as well as a brute-force route.
 *
 * The windows are short (one minute) on purpose: long lockouts let an attacker
 * deliberately lock a real user out by failing on their behalf.
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /** 5/min: a real person mistypes a password twice, not six times. */
  @Post('login')
  @RateLimit({
    limit: 5,
    windowSeconds: 60,
    message: 'Too many sign-in attempts. Please wait a minute and try again.',
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /** Looser: a legitimate client may refresh on several tabs at once. */
  @Post('refresh')
  @RateLimit({ limit: 20, windowSeconds: 60 })
  async refresh(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
  }

  /**
   * Strictest of all: unlimited requests here allow email enumeration, inbox
   * flooding of a real user, and filling the table with reset tokens.
   */
  @Post('forgot-password')
  @RateLimit({
    limit: 3,
    windowSeconds: 60,
    message: 'Too many reset requests. Please wait a minute and try again.',
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  /** Guessing a 32-byte reset token is infeasible, but rate limit it anyway. */
  @Post('reset-password')
  @RateLimit({ limit: 5, windowSeconds: 60 })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  /**
   * Self-service password change. Rate-limited like the other credential
   * endpoints: it accepts a password, so it is a brute-force target even though
   * the caller is already authenticated.
   */
  @UseGuards(JwtAuthGuard)
  @RateLimit({ limit: 10, windowSeconds: 300 })
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Body() dto: ChangePasswordDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.authService.changePassword(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return {
      id: user.sub,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
