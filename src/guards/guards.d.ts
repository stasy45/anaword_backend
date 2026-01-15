import { Request } from 'express';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/services/auth/auth.service';
import { ProjectsService } from 'src/services/projects/projects.service';
export declare class AuthGuard implements CanActivate {
    private readonly request;
    private reflector;
    private authService;
    constructor(request: Request, reflector: Reflector, authService: AuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class UserHasAccessFolderGuard implements CanActivate {
    private projectsService;
    private readonly request;
    constructor(projectsService: ProjectsService, request: Request);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class UserHasAccessProjectGuard implements CanActivate {
    private projectsService;
    private readonly request;
    constructor(projectsService: ProjectsService, request: Request);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class NoParentGuard implements CanActivate {
    private projectsService;
    private readonly request;
    constructor(projectsService: ProjectsService, request: Request);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
