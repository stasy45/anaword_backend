import { DB } from './env';

import { DiscoveryModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Users } from './models/public/users';
import { Folders } from './models/projects/folders';
import { Projects } from './models/projects/projects';
import { Notes } from './models/projects/notes';
import { Pins } from './models/projects/pins';

import { AuthModule } from './services/auth/auth.module';
import { ProjectsModule } from './services/projects/projects.module';


@Module({
  imports: [
    AuthModule,
    ProjectsModule,

    DiscoveryModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: DB.HOST,
      port: DB.PORT,
      database: DB.NAME,
      username: DB.USER,
      password: DB.PASSWORD,
      synchronize: true,
      entities: [
        Users,
        Folders,
        Projects,
        Notes,
        Pins,
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
