import { Users } from '../public/users';
export declare class Folders {
    id: number;
    name: string;
    isDeleted: boolean;
    parentId: number;
    parent: Folders;
    userId: number;
    user: Users;
}
