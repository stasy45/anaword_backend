import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, MaxLength } from "class-validator";
import { FORM_VALIDATION, VALIDATION_ERROR } from "env";




export class FolderDTO {
    @IsNumber({}, { message: FORM_VALIDATION.INT })
    @IsOptional()
    id: number;

    @IsNumber({}, { message: FORM_VALIDATION.INT })
    @IsOptional()
    parentId: number;

    @IsString({ message: FORM_VALIDATION.STRING })
    @IsNotEmpty({ message: FORM_VALIDATION.NOTEMPTY })
    name: string;
}

export class ProjectDTO {
    @IsNumber({}, { message: FORM_VALIDATION.INT })
    @IsOptional()
    id: number;

    @IsNumber({}, { message: FORM_VALIDATION.INT })
    @IsOptional()
    parentId: number;

    @IsString({ message: FORM_VALIDATION.STRING })
    @IsNotEmpty({ message: VALIDATION_ERROR })
    name: string;

    @IsString({ message: FORM_VALIDATION.STRING })
    @IsOptional()
    @MaxLength(100, {message: FORM_VALIDATION.MAXLENGTH(100)})
    description: string;

    @IsString({ message: FORM_VALIDATION.STRING })
    @IsOptional()
    cover: string;
}

export class AllProjectsDTO {
    @IsArray()
    folders: FolderDTO[];

    @IsArray()
    projects: ProjectDTO[];

    @IsArray()
    path: Omit<FolderDTO, 'parentId'>[]
}