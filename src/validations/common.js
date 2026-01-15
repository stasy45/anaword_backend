"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullableIntPipe = void 0;
const common_1 = require("@nestjs/common");
const env_1 = require("../../env");
let NullableIntPipe = class NullableIntPipe {
    transform(value) {
        if (value === undefined || value === null || value === '' || value === 'null') {
            return null;
        }
        const num = Number(value);
        if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
            throw new common_1.BadRequestException(env_1.FORM_VALIDATION.INT);
        }
        return num;
    }
};
exports.NullableIntPipe = NullableIntPipe;
exports.NullableIntPipe = NullableIntPipe = __decorate([
    (0, common_1.Injectable)()
], NullableIntPipe);
//# sourceMappingURL=common.js.map