import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { RichText } from 'src/utils/text-editor';
import { Projects } from './projects';


@Entity({ name: "notes", schema: "projects" })
export class Notes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'json' })
    textJSON: RichText;

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