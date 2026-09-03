"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const app_module_js_1 = require("./app.module.js");
const env_js_1 = require("./config/env.js");
const index_js_1 = require("./common/guards/index.js");
const all_exceptions_filter_js_1 = require("./common/filters/all-exceptions.filter.js");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_js_1.AppModule, {
        logger: env_js_1.isProduction
            ? ['error', 'warn', 'log']
            : ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    if (env_js_1.isProduction) {
        app.set('trust proxy', 1);
    }
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new all_exceptions_filter_js_1.AllExceptionsFilter());
    app.useGlobalGuards(new index_js_1.RateLimitGuard(app.get(core_1.Reflector)));
    app.enableCors({
        origin: env_js_1.env.frontendUrl,
        credentials: true,
        exposedHeaders: ['X-Correlation-Id', 'Retry-After', 'X-RateLimit-Remaining'],
    });
    await app.listen(env_js_1.env.port);
    const logger = new common_1.Logger('Bootstrap');
    logger.log(`Club Infication CRM API running on http://localhost:${env_js_1.env.port}/api (${env_js_1.env.nodeEnv})`);
    logger.log(`Health check: http://localhost:${env_js_1.env.port}/api/health`);
}
bootstrap();
//# sourceMappingURL=main.js.map