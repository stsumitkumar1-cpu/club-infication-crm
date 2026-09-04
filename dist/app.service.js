"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("./database/prisma.service.js");
const env_js_1 = require("./config/env.js");
let AppService = AppService_1 = class AppService {
    prisma;
    logger = new common_1.Logger(AppService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    getHello() {
        return 'Club Infication CRM API';
    }
    async getHealth() {
        const startedAt = Date.now();
        let database;
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            database = { status: 'up', latencyMs: Date.now() - startedAt };
        }
        catch (error) {
            this.logger.error('Health check failed: database unreachable', error instanceof Error ? error.stack : undefined);
            database = {
                status: 'down',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
        return {
            status: database.status === 'up' ? 'ok' : 'degraded',
            service: 'club-infication-crm-api',
            environment: env_js_1.env.nodeEnv,
            uptimeSeconds: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
            checks: { database },
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = AppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map