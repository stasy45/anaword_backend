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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const guards_1 = require("../../guards/guards");
const projects_dto_1 = require("../../dtos/projects.dto");
const common_2 = require("../../validations/common");
let ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    async getProjects(req, parentId) {
        const folders = (await this.projectsService.foldersByParent(parentId, req['user'].id)).map(folder => {
            delete folder.isDeleted;
            delete folder.parentId;
            delete folder.userId;
            return folder;
        });
        const projects = (await this.projectsService.projectsByParent(parentId, req['user'].id)).map(project => {
            delete project.isDeleted;
            delete project.parentId;
            delete project.userId;
            return project;
        });
        const path = (await this.projectsService.getFolderPath(parentId)).map(folder => {
            delete folder.isDeleted;
            delete folder.parentId;
            delete folder.userId;
            return folder;
        });
        return { folders, projects, path };
    }
    async postFolder(req, body) {
        await this.projectsService.postFolder(req['user'].id, body);
    }
    async putFolder(req, body, params) {
        await this.projectsService.putFolder(req['user'].id, { ...body, id: params.folderId });
    }
    async getFolderTree(req) {
        return (await this.projectsService.foldersByUser(req['user'].id)).map(folder => {
            delete folder.isDeleted;
            delete folder.userId;
            return folder;
        });
    }
    async patchFolderMove(body, params) {
        await this.projectsService.updateFolder({ id: params.folderId, ...body });
    }
    async softDeleteFolder(req, params) {
        await this.projectsService.softDeleteFolder(req['user'].id, params.folderId);
    }
    async postProject(req, body) {
        return { id: (await this.projectsService.createProject(req['user'].id, body)).id };
    }
    async patchProjectMove(body, params) {
        await this.projectsService.updateProject({ id: params.projectId, ...body });
    }
    async softDeleteProject(params) {
        await this.projectsService.updateProject({ id: params.projectId, isDeleted: true });
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.UseGuards)(guards_1.NoParentGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('parentId', common_2.NullableIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getProjects", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.NoParentGuard),
    (0, common_1.Post)('folders'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, projects_dto_1.FolderDTO]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "postFolder", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.UserHasAccessFolderGuard, guards_1.NoParentGuard),
    (0, common_1.Put)('folders/:folderId'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, projects_dto_1.FolderDTO, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "putFolder", null);
__decorate([
    (0, common_1.Get)('folders/tree'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getFolderTree", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.UserHasAccessFolderGuard, guards_1.NoParentGuard),
    (0, common_1.Patch)('folders/move/:folderId'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "patchFolderMove", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.UserHasAccessFolderGuard),
    (0, common_1.Delete)('folders/soft/:folderId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "softDeleteFolder", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.NoParentGuard),
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, projects_dto_1.ProjectDTO]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "postProject", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.UserHasAccessProjectGuard, guards_1.NoParentGuard),
    (0, common_1.Patch)('move/:projectId'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "patchProjectMove", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.UserHasAccessProjectGuard),
    (0, common_1.Delete)('soft/:projectId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "softDeleteProject", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map