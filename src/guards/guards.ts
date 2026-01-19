import { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable, ConflictException, Inject, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector, REQUEST } from '@nestjs/core';

import { IS_PUBLIC_KEY } from './public.decorator';
import { AuthService } from 'src/services/auth/auth.service';
import { verifySignedUserId } from 'src/utils/cookie';
import { ProjectsService } from 'src/services/projects/projects.service';
import { VALIDATION, VALIDATION_ERROR } from 'env';



@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private reflector: Reflector,
    private authService: AuthService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const userId = verifySignedUserId(this.request.cookies?.userId);

    if (!this.request.cookies?.userId || !userId) {
      throw new UnauthorizedException(VALIDATION.TOKEN);
    }

    const contextReq = context.switchToHttp().getRequest<Request>();

    const user = await this.authService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException(VALIDATION.USERNOTFOUND);
    }

    contextReq['user'] = user;
    return true;
  }
}


@Injectable()
export class UserHasAccessFolderGuard implements CanActivate {
  constructor(
    private projectsService: ProjectsService,
    @Inject(REQUEST) private readonly request: Request,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest<Request>()['user'];
    const folder = await this.projectsService.folderById(Number(this.request.params['folderId']))

    if (!folder) {
      throw new NotFoundException(VALIDATION.FOLDERNOTFOUND);
    }

    if (folder.userId !== user.id) {
      throw new ForbiddenException(VALIDATION.FOLDERNOTFOUND);
    }

    return true;
  }
}


@Injectable()
export class UserHasAccessProjectGuard implements CanActivate {
  constructor(
    private projectsService: ProjectsService,
    @Inject(REQUEST) private readonly request: Request,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest<Request>()['user'];
    const project = await this.projectsService.projectById(Number(this.request.params['projectId']))

    if (!project) {
      throw new NotFoundException(VALIDATION.PROJECTNOTFOUND);
    }

    if (project.userId !== user.id) {
      throw new ForbiddenException(VALIDATION.PROJECTNOACCESS);
    }

    return true;
  }
}


@Injectable()
export class NoParentGuard implements CanActivate {
  constructor(
    private projectsService: ProjectsService,
    @Inject(REQUEST) private readonly request: Request,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest<Request>()['user'];
    const parentId = Number(this.request.query['parentId']) ?? this.request.body['parentId']

    if (!parentId) return true

    const parent = await this.projectsService.folderById(parentId)

    if (!parent) {
      throw new NotFoundException(VALIDATION.PARENTNOTFOUND);
    }

    if (parent.userId !== user.id) {
      throw new ForbiddenException(VALIDATION.PARENTNOACCESS);
    }

    return true;
  }
}