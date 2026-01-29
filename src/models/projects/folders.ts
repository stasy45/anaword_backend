import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from '../public/users';



@Entity({ name: "folders", schema: "projects" })
export class Folders {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

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
}