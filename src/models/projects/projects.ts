import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Folders } from '../projects/folders';
import { Users } from '../public/users';



@Entity({ name: "projects", schema: "projects" })
export class Projects {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    cover: string;

    @Column({ default: false })
    isDeleted: boolean;

    @Column({ nullable: true })
    parentId: number;

    @ManyToOne(() => Folders, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parentId' })
    parent: Folders;

    @Column()
    userId: number;

    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: Users;
}