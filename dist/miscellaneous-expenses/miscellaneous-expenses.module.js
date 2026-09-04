"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscellaneousExpensesModule = void 0;
const common_1 = require("@nestjs/common");
const miscellaneous_expenses_service_js_1 = require("./miscellaneous-expenses.service.js");
const miscellaneous_expenses_controller_js_1 = require("./miscellaneous-expenses.controller.js");
const database_module_js_1 = require("../database/database.module.js");
let MiscellaneousExpensesModule = class MiscellaneousExpensesModule {
};
exports.MiscellaneousExpensesModule = MiscellaneousExpensesModule;
exports.MiscellaneousExpensesModule = MiscellaneousExpensesModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_js_1.DatabaseModule],
        controllers: [miscellaneous_expenses_controller_js_1.MiscellaneousExpensesController],
        providers: [miscellaneous_expenses_service_js_1.MiscellaneousExpensesService],
    })
], MiscellaneousExpensesModule);
//# sourceMappingURL=miscellaneous-expenses.module.js.map