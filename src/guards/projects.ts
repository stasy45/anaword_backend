import { Request } from 'express';
import { Injectable, CanActivate, Inject, ExecutionContext, NotFoundException, ForbiddenException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { VALIDATION } from "src/env";
import { ProjectsService } from "src/services/projects/projects.service";


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


@Injectable()
export class NoNoteGuard implements CanActivate {
  constructor(
    private projectsService: ProjectsService,
    @Inject(REQUEST) private readonly request: Request,
  ) { }

  async canActivate(): Promise<boolean> {
    const noteId = Number(this.request.params['noteId'])

    const note = await this.projectsService.noteById(noteId)

    if (!note) {
      throw new NotFoundException(VALIDATION.NOTENOTFOUND);
    }

    return true;
  }
}


@Injectable()
export class NoPinGuard implements CanActivate {
  constructor(
    private projectsService: ProjectsService,
    @Inject(REQUEST) private readonly request: Request,
  ) { }

  async canActivate(): Promise<boolean> {
    const pinId = Number(this.request.params['pinId'])

    const pin = await this.projectsService.pinById(pinId)

    if (!pin) {
      throw new NotFoundException(VALIDATION.PINNOTFOUND);
    }

    return true;
  }
}
