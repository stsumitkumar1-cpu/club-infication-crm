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
exports.ImportsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const client_1 = require("@prisma/client");
const imports_service_js_1 = require("./imports.service.js");
const index_js_1 = require("../common/guards/index.js");
const index_js_2 = require("../common/decorators/index.js");
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
let ImportsController = class ImportsController {
    importsService;
    constructor(importsService) {
        this.importsService = importsService;
    }
    upload(file, user) {
        if (!file) {
            throw new common_1.BadRequestException('No file was uploaded.');
        }
        if (!/\.xlsx?$/i.test(file.originalname)) {
            throw new common_1.BadRequestException('Only an Excel workbook (.xlsx) can be imported.');
        }
        return this.importsService.stageWorkbook(file, user);
    }
    findAll() {
        return this.importsService.findAll();
    }
    findOne(id) {
        return this.importsService.findOne(id);
    }
    commit(id, user) {
        return this.importsService.commit(id, user);
    }
    discard(id, user) {
        return this.importsService.discard(id, user);
    }
};
exports.ImportsController = ImportsController;
__decorate([
    (0, index_js_2.RateLimit)({ limit: 10, windowSeconds: 600 }),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: MAX_UPLOAD_BYTES } })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, index_js_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ImportsController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ImportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImportsController.prototype, "findOne", null);
__decorate([
    (0, index_js_2.RateLimit)({ limit: 5, windowSeconds: 600 }),
    (0, common_1.Post)(':id/commit'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_js_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ImportsController.prototype, "commit", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_js_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ImportsController.prototype, "discard", null);
exports.ImportsController = ImportsController = __decorate([
    (0, common_1.UseGuards)(index_js_1.JwtAuthGuard, index_js_1.RolesGuard),
    (0, index_js_2.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.Controller)('imports'),
    __metadata("design:paramtypes", [imports_service_js_1.ImportsService])
], ImportsController);
//# sourceMappingURL=imports.controller.js.map