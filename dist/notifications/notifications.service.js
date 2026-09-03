"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const env_js_1 = require("../config/env.js");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    logger = new common_1.Logger(NotificationsService_1.name);
    get enabled() {
        return process.env.NOTIFICATIONS_ENABLED === 'true';
    }
    money(value) {
        return `₹${value.toLocaleString('en-IN')}`;
    }
    buildNewCustomerEmail(ctx) {
        const lines = [
            `Dear ${ctx.customerName},`,
            '',
            'Thank you for joining Club Infication. Your membership details are below.',
            '',
            `Plan: ${ctx.plan}`,
            ctx.membershipId ? `Membership ID: ${ctx.membershipId}` : null,
            ctx.validity ? `Validity: ${ctx.validity}` : null,
            ctx.totalDays || ctx.totalNights
                ? `Included: ${ctx.totalDays ?? 0} days / ${ctx.totalNights ?? 0} nights`
                : null,
            '',
            `Plan amount: ${this.money(ctx.amount)}`,
            `Amount received: ${this.money(ctx.amountPaid)}`,
            ctx.pendingAmount > 0
                ? `Balance pending: ${this.money(ctx.pendingAmount)}`
                : 'Your plan is fully paid.',
            '',
            'Please contact your Club Infication representative with any questions.',
            '',
            'Club Infication',
        ];
        return {
            to: ctx.customerEmail,
            subject: `Welcome to Club Infication — your ${ctx.plan} membership`,
            body: lines.filter((l) => l !== null).join('\n'),
        };
    }
    async send(message) {
        if (!this.enabled) {
            this.logger.log(`[notifications disabled] would email ${message.to}: "${message.subject}"`);
            return {
                sent: false,
                reason: 'Notifications are disabled. Set NOTIFICATIONS_ENABLED=true once the client confirms the template (Spec 22 #7).',
            };
        }
        this.logger.warn(`Notifications are enabled but no transport is configured; ${message.to} was not emailed.`);
        return {
            sent: false,
            reason: 'No email transport configured.',
        };
    }
    async notifyNewCustomer(ctx) {
        if (!ctx.customerEmail) {
            return { sent: false, reason: 'Customer has no email address on record.' };
        }
        try {
            return await this.send(this.buildNewCustomerEmail(ctx));
        }
        catch (error) {
            this.logger.error(`Failed to notify ${ctx.customerEmail}`, error instanceof Error ? error.stack : undefined);
            return { sent: false, reason: 'Delivery failed; see the server log.' };
        }
    }
    getStatus() {
        return {
            enabled: this.enabled,
            transportConfigured: false,
            environment: env_js_1.env.nodeEnv,
            note: env_js_1.isProduction
                ? 'Configure a transport before enabling in production.'
                : 'Development: messages are logged, never delivered.',
            pendingClarification: 'Spec 22 #7 — is the customer email mandatory, and what is the exact template?',
        };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)()
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map