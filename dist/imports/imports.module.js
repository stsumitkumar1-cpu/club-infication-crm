"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportsModule = void 0;
const common_1 = require("@nestjs/common");
const imports_controller_js_1 = require("./imports.controller.js");
const imports_service_js_1 = require("./imports.service.js");
const database_module_js_1 = require("../database/database.module.js");
const audit_module_js_1 = require("../audit/audit.module.js");
const customers_module_js_1 = require("../customers/customers.module.js");
let ImportsModule = class ImportsModule {
};
exports.ImportsModule = ImportsModule;
exports.ImportsModule = ImportsModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_js_1.DatabaseModule, audit_module_js_1.AuditModule, customers_module_js_1.CustomersModule],
        controllers: [imports_controller_js_1.ImportsController],
        providers: [imports_service_js_1.ImportsService],
    })
], ImportsModule);
//# sourceMappingURL=imports.module.js.map