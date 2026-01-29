import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Folders } from '../projects/folders';
import { Users } from '../public/users';

export type Integration = {
    link: string
}

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

    @Column('text', { array: true, default: [] })
    tags: string[];

    @Column('text', { array: true, nullable: true })
    integrations: string[];

    @Column({ default: false })
    isDeleted: boolean;

    @Column({ type: 'timestamp', nullable: true })
    deletedDate: Date;

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

    @CreateDateColumn({ type: 'timestamp' })
    creationDate: Date;
}