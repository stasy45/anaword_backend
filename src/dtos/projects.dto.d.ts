export declare class FolderDTO {
    id: number;
    parentId: number;
    name: string;
}
export declare class ProjectDTO {
    id: number;
    parentId: number;
    name: string;
    description: string;
    cover: string;
}
export declare class AllProjectsDTO {
    folders: FolderDTO[];
    projects: ProjectDTO[];
    path: Omit<FolderDTO, 'parentId'>[];
}
