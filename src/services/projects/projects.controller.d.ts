import { Request } from 'express';
import { ProjectsService } from "./projects.service";
import { AllProjectsDTO, FolderDTO, ProjectDTO } from "src/dtos/projects.dto";
export declare class ProjectsController {
    private projectsService;
    constructor(projectsService: ProjectsService);
    getProjects(req: Request, parentId?: number | null): Promise<AllProjectsDTO>;
    postFolder(req: Request, body: FolderDTO): Promise<void>;
    putFolder(req: Request, body: FolderDTO, params: {
        folderId: number;
    }): Promise<void>;
    getFolderTree(req: Request): Promise<FolderDTO[]>;
    patchFolderMove(body: Partial<FolderDTO>, params: {
        folderId: number;
    }): Promise<void>;
    softDeleteFolder(req: Request, params: {
        folderId: number;
    }): Promise<void>;
    postProject(req: Request, body: ProjectDTO): Promise<{
        id: number;
    }>;
    patchProjectMove(body: Partial<ProjectDTO>, params: {
        projectId: number;
    }): Promise<void>;
    softDeleteProject(params: {
        projectId: number;
    }): Promise<void>;
}
