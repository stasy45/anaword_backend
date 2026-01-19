import { Repository } from 'typeorm';

import { Injectable } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/models/public/users";

import { verifySignedUserId } from 'src/utils/cookie';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) { }

  //#region db utils

  async findOneById(id: number): Promise<Users | null> {
    if (!id) return null;
    return await this.usersRepository.findOneBy({ id });
  }

  async findAllById(id: number[]): Promise<Users[] | null> {
    return await this.usersRepository.findBy(id.map(id => { return { id } }));
  }

  async findOneByEmail(email: string): Promise<Users | null> {
    if (!email) return null;
    return await this.usersRepository.findOneBy({ email });
  }

  async createUser(user: Partial<Users>): Promise<Users | null> {
    return await this.usersRepository.save(user);
  }

  //#endregion db utils


  //#region requests

  async login(email: string): Promise<number> {
    let user = await this.findOneByEmail(email);

    if (user) {
      return user.id
    } else {
      return (await this.createUser({ email })).id
    }
  }

  //#endregion requests
}