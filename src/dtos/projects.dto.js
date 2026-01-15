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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllProjectsDTO = exports.ProjectDTO = exports.FolderDTO = void 0;
const class_validator_1 = require("class-validator");
const env_1 = require("../../env");
class FolderDTO {
}
exports.FolderDTO = FolderDTO;
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: env_1.FORM_VALIDATION.INT }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FolderDTO.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: env_1.FORM_VALIDATION.INT }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FolderDTO.prototype, "parentId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: env_1.FORM_VALIDATION.STRING }),
    (0, class_validator_1.IsNotEmpty)({ message: env_1.FORM_VALIDATION.NOTEMPTY }),
    __metadata("design:type", String)
], FolderDTO.prototype, "name", void 0);
class ProjectDTO {
}
exports.ProjectDTO = ProjectDTO;
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: env_1.FORM_VALIDATION.INT }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ProjectDTO.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: env_1.FORM_VALIDATION.INT }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ProjectDTO.prototype, "parentId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: env_1.FORM_VALIDATION.STRING }),
    (0, class_validator_1.IsNotEmpty)({ message: env_1.VALIDATION_ERROR }),
    __metadata("design:type", String)
], ProjectDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: env_1.FORM_VALIDATION.STRING }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100, { message: env_1.FORM_VALIDATION.MAXLENGTH(100) }),
    __metadata("design:type", String)
], ProjectDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: env_1.FORM_VALIDATION.STRING }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProjectDTO.prototype, "cover", void 0);
class AllProjectsDTO {
}
exports.AllProjectsDTO = AllProjectsDTO;
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], AllProjectsDTO.prototype, "folders", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], AllProjectsDTO.prototype, "projects", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], AllProjectsDTO.prototype, "path", void 0);
//# sourceMappingURL=projects.dto.js.map