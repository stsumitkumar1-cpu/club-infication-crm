"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PASSWORD_RULES_TEXT = exports.PASSWORD_MAX_LENGTH = exports.PASSWORD_MIN_LENGTH = void 0;
exports.IsStrongPassword = IsStrongPassword;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
exports.PASSWORD_MIN_LENGTH = 8;
exports.PASSWORD_MAX_LENGTH = 72;
exports.PASSWORD_RULES_TEXT = 'At least 8 characters, with an uppercase letter, a lowercase letter and a number.';
function IsStrongPassword() {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(exports.PASSWORD_MIN_LENGTH, {
        message: `Password must be at least ${exports.PASSWORD_MIN_LENGTH} characters`,
    }), (0, class_validator_1.MaxLength)(exports.PASSWORD_MAX_LENGTH, {
        message: `Password must be at most ${exports.PASSWORD_MAX_LENGTH} characters`,
    }), (0, class_validator_1.Matches)(/[a-z]/, {
        message: 'Password must contain a lowercase letter',
    }), (0, class_validator_1.Matches)(/[A-Z]/, {
        message: 'Password must contain an uppercase letter',
    }), (0, class_validator_1.Matches)(/[0-9]/, {
        message: 'Password must contain a number',
    }));
}
//# sourceMappingURL=is-strong-password.decorator.js.map