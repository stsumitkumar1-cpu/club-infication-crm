"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalariesIncentivesModule = void 0;
const common_1 = require("@nestjs/common");
const salaries_incentives_service_js_1 = require("./salaries-incentives.service.js");
const salaries_incentives_controller_js_1 = require("./salaries-incentives.controller.js");
const database_module_js_1 = require("../database/database.module.js");
let SalariesIncentivesModule = class SalariesIncentivesModule {
};
exports.SalariesIncentivesModule = SalariesIncentivesModule;
exports.SalariesIncentivesModule = SalariesIncentivesModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_js_1.DatabaseModule],
        controllers: [salaries_incentives_controller_js_1.SalariesIncentivesController],
        providers: [salaries_incentives_service_js_1.SalariesIncentivesService],
    })
], SalariesIncentivesModule);
//# sourceMappingURL=salaries-incentives.module.js.map