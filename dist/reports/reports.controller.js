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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_js_1 = require("./reports.service.js");
const index_js_1 = require("./dto/index.js");
const index_js_2 = require("../common/guards/index.js");
const index_js_3 = require("../common/decorators/index.js");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getDashboard(user) {
        return this.reportsService.getDashboard(user);
    }
    getExecutivePerformance(query, user) {
        return this.reportsService.getExecutivePerformance(user, query);
    }
    getPendingPayments(query, user) {
        return this.reportsService.getPendingPayments(query, user);
    }
    getCustomerUsage(query, user) {
        return this.reportsService.getCustomerUsage(query, user);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('executive-performance'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.QueryPerformanceDto, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getExecutivePerformance", null);
__decorate([
    (0, common_1.Get)('pending-payments'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.QueryReportDto, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getPendingPayments", null);
__decorate([
    (0, common_1.Get)('customer-usage'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.QueryReportDto, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getCustomerUsage", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.UseGuards)(index_js_2.JwtAuthGuard, index_js_2.RolesGuard),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_js_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map