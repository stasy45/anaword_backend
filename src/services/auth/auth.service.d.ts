import { Repository } from 'typeorm';
import { Users } from "src/models/public/users";
export declare class AuthService {
    private usersRepository;
    constructor(usersRepository: Repository<Users>);
    findOneById(id: number): Promise<Users | null>;
    findAllById(id: number[]): Promise<Users[] | null>;
    findOneByEmail(email: string): Promise<Users | null>;
    createUser(user: Partial<Users>): Promise<Users | null>;
    login(email: string): Promise<number>;
}
