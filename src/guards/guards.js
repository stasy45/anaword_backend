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
exports.NoParentGuard = exports.UserHasAccessProjectGuard = exports.UserHasAccessFolderGuard = exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const public_decorator_1 = require("./public.decorator");
const auth_service_1 = require("../services/auth/auth.service");
const cookie_1 = require("../utils/cookie");
const projects_service_1 = require("../services/projects/projects.service");
const env_1 = require("../../env");
let AuthGuard = class AuthGuard {
    constructor(request, reflector, authService) {
        this.request = request;
        this.reflector = reflector;
        this.authService = authService;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const userId = (0, cookie_1.verifySignedUserId)(this.request.cookies?.userId);
        if (!this.request.cookies?.userId || !userId) {
            throw new common_1.UnauthorizedException(env_1.VALIDATION.TOKEN);
        }
        const contextReq = context.switchToHttp().getRequest();
        const user = await this.authService.findOneById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException(env_1.VALIDATION.USERNOTFOUND);
        }
        contextReq['user'] = user;
        return true;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, core_1.Reflector,
        auth_service_1.AuthService])
], AuthGuard);
let UserHasAccessFolderGuard = class UserHasAccessFolderGuard {
    constructor(projectsService, request) {
        this.projectsService = projectsService;
        this.request = request;
    }
    async canActivate(context) {
        const user = context.switchToHttp().getRequest()['user'];
        const folder = await this.projectsService.folderById(Number(this.request.params['folderId']));
        if (!folder) {
            throw new common_1.NotFoundException(env_1.VALIDATION.FOLDERNOTFOUND);
        }
        if (folder.userId !== user.id) {
            throw new common_1.ForbiddenException(env_1.VALIDATION.FOLDERNOTFOUND);
        }
        return true;
    }
};
exports.UserHasAccessFolderGuard = UserHasAccessFolderGuard;
exports.UserHasAccessFolderGuard = UserHasAccessFolderGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService, Object])
], UserHasAccessFolderGuard);
let UserHasAccessProjectGuard = class UserHasAccessProjectGuard {
    constructor(projectsService, request) {
        this.projectsService = projectsService;
        this.request = request;
    }
    async canActivate(context) {
        const user = context.switchToHttp().getRequest()['user'];
        const project = await this.projectsService.projectById(Number(this.request.params['projectId']));
        if (!project) {
            throw new common_1.NotFoundException(env_1.VALIDATION.PROJECTNOTFOUND);
        }
        if (project.userId !== user.id) {
            throw new common_1.ForbiddenException(env_1.VALIDATION.PROJECTNOACCESS);
        }
        return true;
    }
};
exports.UserHasAccessProjectGuard = UserHasAccessProjectGuard;
exports.UserHasAccessProjectGuard = UserHasAccessProjectGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService, Object])
], UserHasAccessProjectGuard);
let NoParentGuard = class NoParentGuard {
    constructor(projectsService, request) {
        this.projectsService = projectsService;
        this.request = request;
    }
    async canActivate(context) {
        const user = context.switchToHttp().getRequest()['user'];
        const parentId = Number(this.request.query['parentId']) ?? this.request.body['parentId'];
        if (!parentId)
            return true;
        const parent = await this.projectsService.folderById(parentId);
        if (!parent) {
            throw new common_1.NotFoundException(env_1.VALIDATION.PARENTNOTFOUND);
        }
        if (parent.userId !== user.id) {
            throw new common_1.ForbiddenException(env_1.VALIDATION.PARENTNOACCESS);
        }
        return true;
    }
};
exports.NoParentGuard = NoParentGuard;
exports.NoParentGuard = NoParentGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService, Object])
], NoParentGuard);
//# sourceMappingURL=guards.js.map