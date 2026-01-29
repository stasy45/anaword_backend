import { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable, Inject, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector, REQUEST } from '@nestjs/core';

import { IS_PUBLIC_KEY } from './public.decorator';
import { AuthService } from 'src/services/auth/auth.service';
import { verifySignedUserId } from 'src/utils/cookie';
import { ProjectsService } from 'src/services/projects/projects.service';
import { VALIDATION } from 'src/env';



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