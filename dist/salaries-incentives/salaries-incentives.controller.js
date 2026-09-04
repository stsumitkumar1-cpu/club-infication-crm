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
exports.SalariesIncentivesController = void 0;
const common_1 = require("@nestjs/common");
const salaries_incentives_service_js_1 = require("./salaries-incentives.service.js");
const update_salary_dto_js_1 = require("./dto/update-salary.dto.js");
const index_js_1 = require("../common/guards/index.js");
const index_js_2 = require("../common/decorators/index.js");
const client_1 = require("@prisma/client");
let SalariesIncentivesController = class SalariesIncentivesController {
    service;
    constructor(service) {
        this.service = service;
    }
    getSalariesAndIncentives(period) {
        if (!period) {
            const now = new Date();
            period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        }
        return this.service.getSalariesAndIncentives(period);
    }
    updateSalaryAndIncentive(userId, dto) {
        return this.service.updateSalaryAndIncentive(userId, dto);
    }
};
exports.SalariesIncentivesController = SalariesIncentivesController;
__decorate([
    (0, common_1.Get)(),
    (0, index_js_2.Roles)(client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalariesIncentivesController.prototype, "getSalariesAndIncentives", null);
__decorate([
    (0, common_1.Patch)(':userId'),
    (0, index_js_2.Roles)(client_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_salary_dto_js_1.UpdateSalaryDto]),
    __metadata("design:returntype", void 0)
], SalariesIncentivesController.prototype, "updateSalaryAndIncentive", null);
exports.SalariesIncentivesController = SalariesIncentivesController = __decorate([
    (0, common_1.Controller)('salaries-incentives'),
    (0, common_1.UseGuards)(index_js_1.JwtAuthGuard, index_js_1.RolesGuard),
    __metadata("design:paramtypes", [salaries_incentives_service_js_1.SalariesIncentivesService])
], SalariesIncentivesController);
//# sourceMappingURL=salaries-incentives.controller.js.map