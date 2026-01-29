import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folders } from 'src/models/projects/folders';
import { Projects } from 'src/models/projects/projects';
import { Notes } from 'src/models/projects/notes';
import { Pins } from 'src/models/projects/pins';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthModule } from '../auth/auth.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([
      Projects,
      Folders,
      Notes,
      Pins
    ]),
    AuthModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [TypeOrmModule, ProjectsService],
})
export class ProjectsModule { }