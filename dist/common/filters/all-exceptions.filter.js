"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const env_js_1 = require("../../config/env.js");
let AllExceptionsFilter = class AllExceptionsFilter {
    logger = new common_1.Logger('ExceptionFilter');
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();
        const correlationId = req.correlationId;
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = common_1.HttpStatus[status] ?? 'Error';
        let extra = {};
        if (exception instanceof common_1.HttpException) {
            const body = exception.getResponse();
            if (typeof body === 'string') {
                message = body;
            }
            else if (body && typeof body === 'object') {
                const asRecord = body;
                message = asRecord.message ?? exception.message;
                error = asRecord.error ?? error;
                const { message: _m, error: _e, statusCode: _s, ...rest } = asRecord;
                extra = rest;
            }
        }
        if (status >= common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(`${req.method} ${req.originalUrl} failed [${correlationId}]`, exception instanceof Error ? exception.stack : String(exception));
            if (env_js_1.isProduction) {
                message = 'Internal server error';
                extra = {};
            }
            else if (exception instanceof Error) {
                message = exception.message;
            }
        }
        res.status(status).json({
            statusCode: status,
            message,
            error,
            correlationId,
            path: req.originalUrl,
            timestamp: new Date().toISOString(),
            ...extra,
        });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map