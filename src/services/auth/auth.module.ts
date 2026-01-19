import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/models/public/users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';



@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmModule, AuthService],
})
export class AuthModule { }