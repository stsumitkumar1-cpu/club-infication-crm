"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_js_1 = require("./database/database.module.js");
const audit_module_js_1 = require("./audit/audit.module.js");
const auth_module_js_1 = require("./auth/auth.module.js");
const users_module_js_1 = require("./users/users.module.js");
const teams_module_js_1 = require("./teams/teams.module.js");
const packages_module_js_1 = require("./packages/packages.module.js");
const memberships_module_js_1 = require("./memberships/memberships.module.js");
const payments_module_js_1 = require("./payments/payments.module.js");
const refunds_module_js_1 = require("./refunds/refunds.module.js");
const entitlements_module_js_1 = require("./entitlements/entitlements.module.js");
const bookings_module_js_1 = require("./bookings/bookings.module.js");
const reports_module_js_1 = require("./reports/reports.module.js");
const notifications_module_js_1 = require("./notifications/notifications.module.js");
const customers_module_js_1 = require("./customers/customers.module.js");
const search_module_js_1 = require("./search/search.module.js");
const app_controller_js_1 = require("./app.controller.js");
const app_service_js_1 = require("./app.service.js");
const correlation_id_middleware_js_1 = require("./common/middleware/correlation-id.middleware.js");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(correlation_id_middleware_js_1.CorrelationIdMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_js_1.DatabaseModule,
            audit_module_js_1.AuditModule,
            auth_module_js_1.AuthModule,
            users_module_js_1.UsersModule,
            teams_module_js_1.TeamsModule,
            packages_module_js_1.PackagesModule,
            memberships_module_js_1.MembershipsModule,
            payments_module_js_1.PaymentsModule,
            refunds_module_js_1.RefundsModule,
            entitlements_module_js_1.EntitlementsModule,
            bookings_module_js_1.BookingsModule,
            reports_module_js_1.ReportsModule,
            notifications_module_js_1.NotificationsModule,
            customers_module_js_1.CustomersModule,
            search_module_js_1.SearchModule,
        ],
        controllers: [app_controller_js_1.AppController],
        providers: [app_service_js_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map