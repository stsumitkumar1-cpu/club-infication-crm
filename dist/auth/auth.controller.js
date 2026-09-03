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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_js_1 = require("./auth.service.js");
const index_js_1 = require("./dto/index.js");
const index_js_2 = require("../common/guards/index.js");
const index_js_3 = require("../common/decorators/index.js");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(dto) {
        return this.authService.login(dto);
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token is required');
        }
        return this.authService.refreshToken(refreshToken);
    }
    async forgotPassword(dto) {
        return this.authService.forgotPassword(dto);
    }
    async resetPassword(dto) {
        return this.authService.resetPassword(dto);
    }
    changePassword(dto, user) {
        return this.authService.changePassword(user.sub, dto);
    }
    getProfile(user) {
        return {
            id: user.sub,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, index_js_3.RateLimit)({
        limit: 5,
        windowSeconds: 60,
        message: 'Too many sign-in attempts. Please wait a minute and try again.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, index_js_3.RateLimit)({ limit: 20, windowSeconds: 60 }),
    __param(0, (0, common_1.Body)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, index_js_3.RateLimit)({
        limit: 3,
        windowSeconds: 60,
        message: 'Too many reset requests. Please wait a minute and try again.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, index_js_3.RateLimit)({ limit: 5, windowSeconds: 60 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(index_js_2.JwtAuthGuard),
    (0, index_js_3.RateLimit)({ limit: 10, windowSeconds: 300 }),
    (0, common_1.Post)('change-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_js_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(index_js_2.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, index_js_3.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_js_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map