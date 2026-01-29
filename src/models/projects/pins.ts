import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Projects } from './projects';



@Entity({ name: "pins", schema: "projects" })
export class Pins {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    img: string;

    @Column({ default: false })
    isArchived: boolean;

    @Column({ type: 'timestamp', nullable: true })
    archivedDate: Date;

    @Column()
    projectId: number;

    @ManyToOne(() => Projects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' })
    project: Projects;

    @CreateDateColumn({ type: 'timestamp' })
    creationDate: Date;
}