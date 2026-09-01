import * as dotenv from 'dotenv';

// Loaded here rather than in main.ts: ESM evaluates imported modules before the
// importing module's body, so a dotenv.config() call in main.ts would run after
// this file had already read process.env. Real environment variables (CI,
// containers) still win — dotenv does not overwrite what is already set.
dotenv.config();

/**
 * Validated environment configuration — Master Spec 16 (secrets live in the
 * environment, never in source) and 4.1 (`config/`).
 *
 * Every value is read and checked once, at import time, so a misconfigured
 * deployment fails loudly at startup instead of silently falling back to a
 * default that is published in the repository.
 */

const MIN_SECRET_LENGTH = 32;

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env and fill it in.`,
    );
  }
  return value;
}

function requiredSecret(name: string): string {
  const value = required(name);
  if (value.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `${name} must be at least ${MIN_SECRET_LENGTH} characters. Generate one with: node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`,
    );
  }
  return value;
}

function optional(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== '' ? value : fallback;
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  port: Number(optional('PORT', '3000')),
  frontendUrl: optional('FRONTEND_URL', 'http://localhost:5173'),

  databaseUrl: required('DATABASE_URL'),

  jwt: {
    // No `||` fallback anywhere: an unset secret is a hard failure, because a
    // known signing key lets anyone forge a Super Admin token.
    accessSecret: requiredSecret('JWT_SECRET'),
    refreshSecret: requiredSecret('JWT_REFRESH_SECRET'),
    accessTtl: optional('JWT_ACCESS_TTL', '15m'),
    refreshTtl: optional('JWT_REFRESH_TTL', '7d'),
  },
} as const;

export const isProduction = env.nodeEnv === 'production';
