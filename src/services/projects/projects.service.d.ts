import { Repository } from 'typeorm';
import { Projects } from 'src/models/projects/projects';
import { Folders } from 'src/models/projects/folders';
export declare class ProjectsService {
    private projectsRepository;
    private foldersRepository;
    constructor(projectsRepository: Repository<Projects>, foldersRepository: Repository<Folders>);
    folderById(folderId: number, isDeleted?: boolean): Promise<Folders | null>;
    foldersByUser(userId: number, isDeleted?: boolean): Promise<Folders[] | null>;
    foldersByParent(parentId: number | null, userId: number, isDeleted?: boolean): Promise<Folders[] | null>;
    getFolderPath(folderId: number): Promise<Folders[]>;
    createFolder(userId: number, folder: Partial<Folders>): Promise<void>;
    updateFolder(folder: Partial<Folders>): Promise<void>;
    projectById(projectId: number): Promise<Projects | null>;
    projectsByParent(parentId: number | null, userId: number, isDeleted?: boolean): Promise<Projects[] | null>;
    createProject(userId: number, project: Partial<Projects>): Promise<Projects>;
    updateProject(project: Partial<Projects>): Promise<void>;
    createUniqName(userId: number, folder: Partial<Folders>): Promise<string>;
    postFolder(userId: number, folder: Partial<Folders>): Promise<void>;
    putFolder(userId: number, folder: Partial<Folders>): Promise<void>;
    softDeleteFolder(userId: number, folderId: number): Promise<void>;
}
