import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Request } from 'express';
import { ProjectsService } from "./projects.service";
import { AuthGuard, NoParentGuard, UserHasAccessFolderGuard, UserHasAccessProjectGuard } from "src/guards/guards";
import { AllProjectsDTO, FolderDTO, ProjectDTO } from "src/dtos/projects.dto";
import { NullableIntPipe } from "src/validations/common";



@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(
    private projectsService: ProjectsService,
  ) { }

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
  async patchFolderMove(@Body() body: Partial<FolderDTO>, @Param() params: { folderId: number }): Promise<void> {
    await this.projectsService.updateFolder({ id: params.folderId, ...body })
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
  async patchProjectMove(@Body() body: Partial<ProjectDTO>, @Param() params: { projectId: number }): Promise<void> {
    await this.projectsService.updateProject({ id: params.projectId, ...body })
  }

  @UseGuards(UserHasAccessProjectGuard)
  @Delete('soft/:projectId')
  async softDeleteProject(@Param() params: { projectId: number }): Promise<void> {
    await this.projectsService.updateProject({ id: params.projectId, isDeleted: true })
  }
}