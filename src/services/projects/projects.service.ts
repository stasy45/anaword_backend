import { IsNull, Like, Repository } from 'typeorm';

import { Injectable } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Projects } from 'src/models/projects/projects';
import { Folders } from 'src/models/projects/folders';



@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Projects)
    private projectsRepository: Repository<Projects>,
    @InjectRepository(Folders)
    private foldersRepository: Repository<Folders>,
  ) { }

  //#region db utils

  async folderById(folderId: number, isDeleted: boolean = false): Promise<Folders | null> {
    return await this.foldersRepository.findOneBy({ id: folderId, isDeleted });
  }

  async foldersByUser(userId: number, isDeleted: boolean = false): Promise<Folders[] | null> {
    return await this.foldersRepository.findBy({ userId, isDeleted });
  }

  async foldersByParent(parentId: number | null, userId: number, isDeleted: boolean = false): Promise<Folders[] | null> {
    if (parentId === null) {
      return await this.foldersRepository.findBy({ parentId: IsNull(), userId, isDeleted });
    }

    return await this.foldersRepository.findBy({ parentId, userId, isDeleted });
  }

  async getFolderPath(folderId: number): Promise<Folders[]> {
    const path: Folders[] = [];
    let currentId: number | null = folderId;

    const visited = new Set<number>();

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

  async createFolder(userId: number, folder: Partial<Folders>): Promise<void> {
    await this.foldersRepository.save({ userId, ...folder });
  }

  async updateFolder(folder: Partial<Folders>): Promise<void> {
    await this.foldersRepository.update(folder.id, { ...folder });
  }

  // -------------

  async projectById(projectId: number): Promise<Projects | null> {
    return await this.projectsRepository.findOneBy({ id: projectId });
  }

  async projectsByParent(parentId: number | null, userId: number, isDeleted: boolean = false): Promise<Projects[] | null> {
    if (parentId === null) {
      return await this.projectsRepository.findBy({ parentId: IsNull(), userId, isDeleted });
    }
    return await this.projectsRepository.findBy({ parentId, userId, isDeleted });
  }

  async createProject(userId: number, project: Partial<Projects>): Promise<Projects> {
    return await this.projectsRepository.save({ userId, ...project });
  }

  async updateProject(project: Partial<Projects>): Promise<void> {
    await this.projectsRepository.update(project.id, { ...project });
  }

  //#endregion db utils


  //#region requests

  async createUniqName(userId: number, folder: Partial<Folders>): Promise<string> {
    const {
      name,
      parentId
    } = folder;

    const baseName = name.trim();

    const existingFolders = await this.foldersRepository.find({
      where: [
        { name: baseName, parentId, userId, isDeleted: false },
        { name: Like(`${baseName} (%)`), parentId, userId, isDeleted: false },
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
        if (num > maxNum) maxNum = num;
      }
    }

    const newName = `${baseName} (${maxNum + 1})`;
    return newName;
  }

  async postFolder(userId: number, folder: Partial<Folders>): Promise<void> {
    return this.createFolder(userId, { ...folder, name: await this.createUniqName(userId, folder) });
  }

  async putFolder(userId: number, folder: Partial<Folders>): Promise<void> {
    return this.updateFolder({ ...folder, name: await this.createUniqName(userId, folder) });
  }

  async softDeleteFolder(userId: number, folderId: number): Promise<void> {
    (await this.projectsByParent(folderId, userId)).map(project => {
      this.updateProject({ id: project.id, isDeleted: true })
    })
    this.updateFolder({ id: folderId, isDeleted: true });
  }

  //#endregion requests
}