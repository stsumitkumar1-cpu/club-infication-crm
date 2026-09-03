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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduction = exports.env = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const MIN_SECRET_LENGTH = 32;
function required(name) {
    const value = process.env[name];
    if (!value || value.trim() === '') {
        throw new Error(`Missing required environment variable ${name}. Copy .env.example to .env and fill it in.`);
    }
    return value;
}
function requiredSecret(name) {
    const value = required(name);
    if (value.length < MIN_SECRET_LENGTH) {
        throw new Error(`${name} must be at least ${MIN_SECRET_LENGTH} characters. Generate one with: node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`);
    }
    return value;
}
function optional(name, fallback) {
    const value = process.env[name];
    return value && value.trim() !== '' ? value : fallback;
}
exports.env = {
    nodeEnv: optional('NODE_ENV', 'development'),
    port: Number(optional('PORT', '3000')),
    frontendUrl: optional('FRONTEND_URL', 'http://localhost:5173'),
    databaseUrl: required('DATABASE_URL'),
    jwt: {
        accessSecret: requiredSecret('JWT_SECRET'),
        refreshSecret: requiredSecret('JWT_REFRESH_SECRET'),
        accessTtl: optional('JWT_ACCESS_TTL', '15m'),
        refreshTtl: optional('JWT_REFRESH_TTL', '7d'),
    },
};
exports.isProduction = exports.env.nodeEnv === 'production';
//# sourceMappingURL=env.js.map