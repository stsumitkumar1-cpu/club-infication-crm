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
exports.RefundsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const refunds_service_js_1 = require("./refunds.service.js");
const index_js_1 = require("./dto/index.js");
const index_js_2 = require("../common/guards/index.js");
const index_js_3 = require("../common/decorators/index.js");
let RefundsController = class RefundsController {
    refundsService;
    constructor(refundsService) {
        this.refundsService = refundsService;
    }
    create(dto, user) {
        return this.refundsService.create(dto, user);
    }
    findAll(query, user) {
        return this.refundsService.findAll(query, user);
    }
    getStats(user) {
        return this.refundsService.getStats(user);
    }
    findOne(id, user) {
        return this.refundsService.findOne(id, user);
    }
    update(id, dto, user) {
        return this.refundsService.update(id, dto, user);
    }
    remove(id, user) {
        return this.refundsService.remove(id, user);
    }
};
exports.RefundsController = RefundsController;
__decorate([
    (0, common_1.Post)(),
    (0, index_js_3.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.CreateRefundDto, Object]),
    __metadata("design:returntype", void 0)
], RefundsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.QueryRefundsDto, Object]),
    __metadata("design:returntype", void 0)
], RefundsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RefundsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RefundsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, index_js_3.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.MANAGER),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, index_js_1.UpdateRefundDto, Object]),
    __metadata("design:returntype", void 0)
], RefundsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, index_js_3.Roles)(client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RefundsController.prototype, "remove", null);
exports.RefundsController = RefundsController = __decorate([
    (0, common_1.UseGuards)(index_js_2.JwtAuthGuard, index_js_2.RolesGuard),
    (0, common_1.Controller)('refunds'),
    __metadata("design:paramtypes", [refunds_service_js_1.RefundsService])
], RefundsController);
//# sourceMappingURL=refunds.controller.js.map