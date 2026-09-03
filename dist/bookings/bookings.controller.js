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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bookings_service_js_1 = require("./bookings.service.js");
const index_js_1 = require("./dto/index.js");
const index_js_2 = require("../common/guards/index.js");
const index_js_3 = require("../common/decorators/index.js");
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    create(dto, user) {
        return this.bookingsService.create(dto, user);
    }
    findAll(query, user) {
        return this.bookingsService.findAll(query, user);
    }
    getStats(user) {
        return this.bookingsService.getStats(user);
    }
    findOne(id, user) {
        return this.bookingsService.findOne(id, user);
    }
    update(id, dto, user) {
        return this.bookingsService.update(id, dto, user);
    }
    cancel(id, user) {
        return this.bookingsService.cancel(id, user);
    }
    complete(id, user) {
        return this.bookingsService.complete(id, user);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)(),
    (0, index_js_3.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.MANAGER, client_1.Role.EXECUTIVE),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.CreateBookingDto, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.QueryBookingsDto, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, index_js_3.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.MANAGER, client_1.Role.EXECUTIVE),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, index_js_1.UpdateBookingDto, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, index_js_3.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.MANAGER, client_1.Role.EXECUTIVE),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, index_js_3.Roles)(client_1.Role.SUPER_ADMIN, client_1.Role.MANAGER, client_1.Role.EXECUTIVE),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "complete", null);
exports.BookingsController = BookingsController = __decorate([
    (0, common_1.UseGuards)(index_js_2.JwtAuthGuard, index_js_2.RolesGuard),
    (0, common_1.Controller)('bookings'),
    __metadata("design:paramtypes", [bookings_service_js_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map