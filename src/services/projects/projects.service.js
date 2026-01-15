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
exports.ProjectsService = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const projects_1 = require("../../models/projects/projects");
const folders_1 = require("../../models/projects/folders");
let ProjectsService = class ProjectsService {
    constructor(projectsRepository, foldersRepository) {
        this.projectsRepository = projectsRepository;
        this.foldersRepository = foldersRepository;
    }
    async folderById(folderId, isDeleted = false) {
        return await this.foldersRepository.findOneBy({ id: folderId, isDeleted });
    }
    async foldersByUser(userId, isDeleted = false) {
        return await this.foldersRepository.findBy({ userId, isDeleted });
    }
    async foldersByParent(parentId, userId, isDeleted = false) {
        if (parentId === null) {
            return await this.foldersRepository.findBy({ parentId: (0, typeorm_1.IsNull)(), userId, isDeleted });
        }
        return await this.foldersRepository.findBy({ parentId, userId, isDeleted });
    }
    async getFolderPath(folderId) {
        const path = [];
        let currentId = folderId;
        const visited = new Set();
        while (currentId !== null) {
            if (visited.has(currentId)) {
                throw new Error('Обнаружена циклическая ссылка в иерархии папок');
            }
            visited.add(currentId);
            const folder = await this.foldersRepository.findOneBy({ id: currentId });
            path.unshift(folder);
            currentId = folder.parentId;
        }
        return path;
    }
    async createFolder(userId, folder) {
        await this.foldersRepository.save({ userId, ...folder });
    }
    async updateFolder(folder) {
        await this.foldersRepository.update(folder.id, { ...folder });
    }
    async projectById(projectId) {
        return await this.projectsRepository.findOneBy({ id: projectId });
    }
    async projectsByParent(parentId, userId, isDeleted = false) {
        if (parentId === null) {
            return await this.projectsRepository.findBy({ parentId: (0, typeorm_1.IsNull)(), userId, isDeleted });
        }
        return await this.projectsRepository.findBy({ parentId, userId, isDeleted });
    }
    async createProject(userId, project) {
        return await this.projectsRepository.save({ userId, ...project });
    }
    async updateProject(project) {
        await this.projectsRepository.update(project.id, { ...project });
    }
    async createUniqName(userId, folder) {
        const { name, parentId } = folder;
        const baseName = name.trim();
        const existingFolders = await this.foldersRepository.find({
            where: [
                { name: baseName, parentId, userId, isDeleted: false },
                { name: (0, typeorm_1.Like)(`${baseName} (%)`), parentId, userId, isDeleted: false },
            ],
        });
        if (existingFolders.length === 0) {
            return baseName;
        }
        let maxNum = 0;
        const escapedBase = baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`^${escapedBase} \\((\\d+)\\)$`);
        for (const f of existingFolders) {
            const match = f.name.match(pattern);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxNum)
                    maxNum = num;
            }
        }
        const newName = `${baseName} (${maxNum + 1})`;
        return newName;
    }
    async postFolder(userId, folder) {
        return this.createFolder(userId, { ...folder, name: await this.createUniqName(userId, folder) });
    }
    async putFolder(userId, folder) {
        return this.updateFolder({ ...folder, name: await this.createUniqName(userId, folder) });
    }
    async softDeleteFolder(userId, folderId) {
        (await this.projectsByParent(folderId, userId)).map(project => {
            this.updateProject({ id: project.id, isDeleted: true });
        });
        this.updateFolder({ id: folderId, isDeleted: true });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(projects_1.Projects)),
    __param(1, (0, typeorm_2.InjectRepository)(folders_1.Folders)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map