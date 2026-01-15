import { Folders } from '../projects/folders';
import { Users } from '../public/users';
export declare class Projects {
    id: number;
    name: string;
    description: string;
    cover: string;
    isDeleted: boolean;
    parentId: number;
    parent: Folders;
    userId: number;
    user: Users;
}
