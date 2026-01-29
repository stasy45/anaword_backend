import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, MaxLength, IsDefined } from "class-validator";
import { FORM_VALIDATION, VALIDATION_ERROR } from "src/env";


export class FolderDTO {
    @IsNumber({}, { message: FORM_VALIDATION.INT })
    @IsOptional()
    id: number;

    @IsNumber({}, { message: FORM_VALIDATION.INT })
    @IsOptional()
    parentId: number;

    @IsString({ message: FORM_VALIDATION.STRING })
    @IsNotEmpty({ message: FORM_VALIDATION.NOTEMPTY })
    @IsDefined({ message: FORM_VALIDATION.NOTEMPTY })
    name: string;
}

export class ParentIdDTO {
    @IsNumber({}, { message: FORM_VALIDATION.INT })
    @IsOptional()
    parentId: number;
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
    @IsDefined({ message: FORM_VALIDATION.NOTEMPTY })
    name: string;

    @IsString({ message: FORM_VALIDATION.STRING })
    @IsOptional()
    @MaxLength(100, { message: FORM_VALIDATION.MAXLENGTH(100) })
    description: string;

    @IsString({ message: FORM_VALIDATION.STRING })
    @IsOptional()
    cover: string;
}

export class CoverDTO {
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

export class ProjectInfoDTO {
    @IsString({ message: FORM_VALIDATION.STRING })
    @IsNotEmpty({ message: VALIDATION_ERROR })
    @IsDefined({ message: FORM_VALIDATION.NOTEMPTY })
    name: string;

    @IsString({ message: FORM_VALIDATION.STRING })
    @IsOptional()
    @MaxLength(100, { message: FORM_VALIDATION.MAXLENGTH(100) })
    description: string;

    @IsString({ message: FORM_VALIDATION.STRING })
    @IsOptional()
    cover: string;

    @IsArray()
    @IsOptional()
    tags: string[];

    stats: {
        creationDate: string
    }
}

export class TagsDTO {
    @IsArray()
    @IsOptional()
    tags: string[];
}

export class NoteDTO {
    @IsNumber({}, { message: FORM_VALIDATION.INT })
    @IsOptional()
    id: number;

    @IsNotEmpty({ message: FORM_VALIDATION.NOTEMPTY })
    @IsDefined({ message: FORM_VALIDATION.NOTEMPTY })
    @IsString({ message: FORM_VALIDATION.STRING })
    textJSON: string;

    @IsString({ message: FORM_VALIDATION.STRING })
    creationDate: string;
}

export class TextJSONDTO {
    @IsNotEmpty({ message: FORM_VALIDATION.NOTEMPTY })
    @IsDefined({ message: FORM_VALIDATION.NOTEMPTY })
    @IsString({ message: FORM_VALIDATION.STRING })
    textJSON: string;
}


export class PinDTO {
    @IsNumber({}, { message: FORM_VALIDATION.INT })
    @IsOptional()
    id: number;

    @IsNotEmpty({ message: FORM_VALIDATION.NOTEMPTY })
    @IsDefined({ message: FORM_VALIDATION.NOTEMPTY })
    @IsString({ message: FORM_VALIDATION.STRING })
    img: string;
}

export class ImgDTO {
    @IsNotEmpty({ message: FORM_VALIDATION.NOTEMPTY })
    @IsDefined({ message: FORM_VALIDATION.NOTEMPTY })
    @IsString({ message: FORM_VALIDATION.STRING })
    img: string;
}