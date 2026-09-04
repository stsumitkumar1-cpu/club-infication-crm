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
exports.PackagesController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const packages_service_js_1 = require("./packages.service.js");
const index_js_1 = require("./dto/index.js");
const index_js_2 = require("../common/guards/index.js");
const index_js_3 = require("../common/decorators/index.js");
let PackagesController = class PackagesController {
    packagesService;
    constructor(packagesService) {
        this.packagesService = packagesService;
    }
    findAll(query) {
        return this.packagesService.findAll(query);
    }
    findOne(id) {
        return this.packagesService.findOne(id);
    }
    create(dto, user) {
        return this.packagesService.create(dto, user);
    }
    update(id, dto, user) {
        return this.packagesService.update(id, dto, user);
    }
    activate(id, user) {
        return this.packagesService.setActive(id, true, user);
    }
    deactivate(id, user) {
        return this.packagesService.setActive(id, false, user);
    }
    remove(id, user) {
        return this.packagesService.remove(id, user);
    }
};
exports.PackagesController = PackagesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.QueryPackagesDto]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "findOne", null);
__decorate([
    (0, index_js_3.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.MANAGER),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.CreatePackageDto, Object]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "create", null);
__decorate([
    (0, index_js_3.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, index_js_1.UpdatePackageDto, Object]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "update", null);
__decorate([
    (0, index_js_3.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.Patch)(':id/activate'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "activate", null);
__decorate([
    (0, index_js_3.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "deactivate", null);
__decorate([
    (0, index_js_3.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "remove", null);
exports.PackagesController = PackagesController = __decorate([
    (0, common_1.UseGuards)(index_js_2.JwtAuthGuard, index_js_2.RolesGuard),
    (0, common_1.Controller)('packages'),
    __metadata("design:paramtypes", [packages_service_js_1.PackagesService])
], PackagesController);
//# sourceMappingURL=packages.controller.js.map