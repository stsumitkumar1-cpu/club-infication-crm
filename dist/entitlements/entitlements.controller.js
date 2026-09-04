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
exports.EntitlementsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const entitlements_service_js_1 = require("./entitlements.service.js");
const index_js_1 = require("./dto/index.js");
const index_js_2 = require("../common/guards/index.js");
const index_js_3 = require("../common/decorators/index.js");
let EntitlementsController = class EntitlementsController {
    entitlementsService;
    constructor(entitlementsService) {
        this.entitlementsService = entitlementsService;
    }
    getBalance(query, user) {
        return this.entitlementsService.getBalance(query, user);
    }
    findAll(query, user) {
        return this.entitlementsService.findAll(query, user);
    }
    adjust(dto, user) {
        return this.entitlementsService.adjust(dto, user);
    }
};
exports.EntitlementsController = EntitlementsController;
__decorate([
    (0, common_1.Get)('balance'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.BalanceQueryDto, Object]),
    __metadata("design:returntype", void 0)
], EntitlementsController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.QueryLedgerDto, Object]),
    __metadata("design:returntype", void 0)
], EntitlementsController.prototype, "findAll", null);
__decorate([
    (0, index_js_3.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.Post)('adjust'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.AdjustEntitlementDto, Object]),
    __metadata("design:returntype", void 0)
], EntitlementsController.prototype, "adjust", null);
exports.EntitlementsController = EntitlementsController = __decorate([
    (0, common_1.UseGuards)(index_js_2.JwtAuthGuard, index_js_2.RolesGuard),
    (0, common_1.Controller)('entitlements'),
    __metadata("design:paramtypes", [entitlements_service_js_1.EntitlementsService])
], EntitlementsController);
//# sourceMappingURL=entitlements.controller.js.map