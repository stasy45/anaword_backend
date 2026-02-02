import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { Request } from 'express';
import { ProjectsService } from "./projects.service";
import { AuthGuard, UserHasAccessProjectGuard } from "src/guards/common";
import { AllProjectsDTO, FolderDTO, ParentIdDTO, NoteDTO, PinDTO, ProjectDTO, ProjectInfoDTO, TagsDTO, TextJSONDTO, CoverDTO, ImgDTO } from "src/dtos/projects.dto";
import { NoParentGuard, UserHasAccessFolderGuard, NoNoteGuard, NoPinGuard } from "src/guards/projects";
import { NullableIntPipe } from "src/validations/common";
import { ImageContextFileInterceptor } from "src/guards/files.interceptor";
import { join } from "path";
import { removeFile } from "src/utils/files";
import { DEFAULT_IMAGE_DEST } from "src/env";



@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(
    private projectsService: ProjectsService,
  ) { }

  //#region projects list

  @UseGuards(NoParentGuard)
  @Get()
  async getProjects(@Req() req: Request, @Query('parentId', NullableIntPipe) parentId?: number | null): Promise<AllProjectsDTO> {
    const folders = (await this.projectsService.foldersByParent(parentId, req['user'].id)).map(folder => {
      delete folder.isDeleted; delete folder.parentId; delete folder.userId
      return folder
    })
    const projects = (await this.projectsService.projectsByParent(parentId, req['user'].id)).map(project => {
      delete project.isDeleted; delete project.parentId; delete project.userId
      return project
    })
    const path = (await this.projectsService.getFolderPath(parentId)).map(folder => {
      delete folder.isDeleted; delete folder.parentId; delete folder.userId
      return folder
    })

    return { folders, projects, path }
  }

  @UseGuards(NoParentGuard)
  @Post('folders')
  @UsePipes(ValidationPipe)
  async postFolder(@Req() req: Request, @Body() body: FolderDTO): Promise<void> {
    await this.projectsService.postFolder(req['user'].id, body)
  }

  @UseGuards(UserHasAccessFolderGuard, NoParentGuard)
  @Put('folders/:folderId')
  @UsePipes(ValidationPipe)
  async putFolder(@Req() req: Request, @Body() body: FolderDTO, @Param() params: { folderId: number }): Promise<void> {
    await this.projectsService.putFolder(req['user'].id, { ...body, id: params.folderId })
  }

  @Get('folders/tree')
  async getFolderTree(@Req() req: Request): Promise<FolderDTO[]> {
    return (await this.projectsService.foldersByUser(req['user'].id)).map(folder => {
      delete folder.isDeleted; delete folder.userId
      return folder
    })
  }

  @UseGuards(UserHasAccessFolderGuard, NoParentGuard)
  @Patch('folders/move/:folderId')
  @UsePipes(ValidationPipe)
  async patchFolderMove(@Body() body: ParentIdDTO, @Param() params: { folderId: number }): Promise<void> {
    await this.projectsService.updateFolder({ id: params.folderId, parentId: body.parentId })
  }

  @UseGuards(UserHasAccessFolderGuard)
  @Delete('folders/soft/:folderId')
  async softDeleteFolder(@Req() req: Request, @Param() params: { folderId: number }): Promise<void> {
    await this.projectsService.softDeleteFolder(req['user'].id, params.folderId)
  }

  @UseGuards(NoParentGuard)
  @Post()
  @UsePipes(ValidationPipe)
  async postProject(@Req() req: Request, @Body() body: ProjectDTO): Promise<{ id: number }> {
    return { id: (await this.projectsService.createProject(req['user'].id, body)).id }
  }

  @UseGuards(UserHasAccessProjectGuard, NoParentGuard)
  @Patch('move/:projectId')
  @UsePipes(ValidationPipe)
  async patchProjectMove(@Body() body: ParentIdDTO, @Param() params: { projectId: number }): Promise<void> {
    await this.projectsService.updateProject(params.projectId, { parentId: body.parentId })
  }

  @UseGuards(UserHasAccessProjectGuard)
  @Delete('soft/:projectId')
  async softDeleteProject(@Param() params: { projectId: number }): Promise<void> {
    await this.projectsService.updateProject(params.projectId, { isDeleted: true, deletedDate: new Date() })
  }

  //#endregion projects list

  @UseGuards(UserHasAccessProjectGuard)
  @Get(':projectId')
  async getProject(@Param() params: { projectId: number }): Promise<ProjectInfoDTO> {
    const project = await this.projectsService.projectById(params.projectId)
    return {
      stats: { creationDate: project.creationDate.toLocaleDateString() },
      tags: project.tags,
      name: project.name,
      description: project.description,
      cover: project.cover,
    }
  }

  @UseGuards(UserHasAccessProjectGuard)
  @Patch(':projectId')
  @UsePipes(ValidationPipe)
  async patchProject(@Body() body: ProjectDTO, @Param() params: { projectId: number }): Promise<void> {
    await this.projectsService.updateProject(params.projectId, { name: body.name, description: body.description })
  }

  @UseGuards(UserHasAccessProjectGuard)
  @Patch(':projectId/tags')
  @UsePipes(ValidationPipe)
  async patchProjectTags(@Body() body: TagsDTO, @Param() params: { projectId: number }): Promise<void> {
    await this.projectsService.updateProject(params.projectId, { tags: body.tags })
  }

  @UseGuards(UserHasAccessProjectGuard)
  @Get(':projectId/notes')
  async getNotes(@Param() params: { projectId: number }): Promise<NoteDTO[]> {
    return (await this.projectsService.notesByProject(params.projectId)).sort((notePrev, noteNext) => notePrev.position - noteNext.position).map(note => {
      delete note.archivedDate, delete note.isArchived, delete note.projectId
      return { ...note, textJSON: JSON.stringify(note.textJSON), creationDate: `${note.creationDate.toLocaleDateString()} ${note.creationDate.toLocaleTimeString()}` }
    })
  }

  @UseGuards(UserHasAccessProjectGuard)
  @Post(':projectId/notes')
  @UsePipes(ValidationPipe)
  async postNote(@Param() params: { projectId: number }, @Body() body: TextJSONDTO): Promise<void> {
    const textJSON = JSON.parse(body.textJSON)
    await this.projectsService.createNote(params.projectId, { ...body, textJSON, position: 0 })
  }

  @UseGuards(UserHasAccessProjectGuard)
  @Patch(':projectId/notes')
  @UsePipes(ValidationPipe)
  async patchNotesOrder(@Body() body: number[]): Promise<void> {
    await body.map((id, idx) => this.projectsService.updateNote(id, { position: idx }))
  }

  @UseGuards(UserHasAccessProjectGuard, NoNoteGuard)
  @Put(':projectId/notes/:noteId')
  @UsePipes(ValidationPipe)
  async putNote(@Param() params: { noteId: number }, @Body() body: TextJSONDTO): Promise<void> {
    const textJSON = JSON.parse(body.textJSON)
    await this.projectsService.updateNote(params.noteId, { ...body, textJSON })
  }

  @UseGuards(UserHasAccessProjectGuard, NoNoteGuard)
  @Delete(':projectId/notes/archive/:noteId')
  async archiveNote(@Param() params: { noteId: number }): Promise<void> {
    await this.projectsService.updateNote(params.noteId, { isArchived: true, archivedDate: new Date() })
  }

  @UseGuards(UserHasAccessProjectGuard)
  @Post(':projectId/cover')
  @UseInterceptors(
    ImageContextFileInterceptor('cover', (req) => (`${DEFAULT_IMAGE_DEST}/${req['user'].id}/${req.params?.projectId}`)),
  )
  async postCover(
    @Req() req: Request,
    @Param() params: { projectId: number },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const userId = req['user'].id;

    const projectCover = (await this.projectsService.projectById(params.projectId)).cover
    projectCover && await removeFile(join(process.cwd(), '..', projectCover))

    await this.projectsService.updateProject(params.projectId, {
      cover: `/images/${userId}/${params.projectId}/${file.filename}`,
    });
  }

  @UseGuards(UserHasAccessProjectGuard)
  @Post(':projectId/cover/link')
  @UsePipes(ValidationPipe)
  async postCoverLink(@Param() params: { projectId: number }, @Body() body: CoverDTO): Promise<void> {
    if (!body.cover) {
      const project = await this.projectsService.projectById(params.projectId);

      const fullPath = join(process.cwd(), '..', project.cover);
      await removeFile(fullPath);
    }

    await this.projectsService.updateProject(params.projectId, { ...body });
  }

  @UseGuards(UserHasAccessProjectGuard)
  @Get(':projectId/pins')
  async getPins(@Param() params: { projectId: number }): Promise<PinDTO[]> {
    return (await this.projectsService.pinsByProject(params.projectId)).map(pin => {
      delete pin.archivedDate, delete pin.isArchived, delete pin.projectId
      return { ...pin }
    })
  }

  @UseGuards(UserHasAccessProjectGuard)
  @Post(':projectId/pins')
  @UseInterceptors(
    ImageContextFileInterceptor('img', (req) => (`${DEFAULT_IMAGE_DEST}/${req['user'].id}/${req.params?.projectId}/pins`)),
  )
  async postPin(
    @Req() req: Request,
    @Param() params: { projectId: number },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {

    const userId = req['user'].id;

    await this.projectsService.createPin(params.projectId, {
      img: `/images/${userId}/${params.projectId}/pins/${file.filename}`,
    });
  }

  @UseGuards(UserHasAccessProjectGuard)
  @Post(':projectId/pins/link')
  @UsePipes(ValidationPipe)
  async postPinLink(@Param() params: { projectId: number }, @Body() body: ImgDTO): Promise<void> {
    await this.projectsService.createPin(params.projectId, { projectId: params.projectId, ...body });
  }

  @UseGuards(UserHasAccessProjectGuard, NoPinGuard)
  @Delete(':projectId/pins/archive/:pinId')
  async archivePin(@Param() params: { pinId: number }): Promise<void> {
    await this.projectsService.updatePin(params.pinId, { isArchived: true, archivedDate: new Date() });
  }

  @UseGuards(UserHasAccessProjectGuard)
  @Get(':projectId/integrations')
  async getIntegrations(@Param() params: { projectId: number }): Promise<string[]> {
    const project = await this.projectsService.projectById(params.projectId)
    return project.integrations
  }

  @UseGuards(UserHasAccessProjectGuard)
  @Patch(':projectId/integrations')
  @UsePipes(ValidationPipe)
  async patchProjectIntegrations(@Body() body: string[], @Param() params: { projectId: number }): Promise<void> {
    await this.projectsService.updateProject(params.projectId, { integrations: body })
  }
}