import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folders } from 'src/models/projects/folders';
import { Projects } from 'src/models/projects/projects';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthModule } from '../auth/auth.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([
      Projects,
      Folders
    ]),
    AuthModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [TypeOrmModule, ProjectsService],
})
export class ProjectsModule { }