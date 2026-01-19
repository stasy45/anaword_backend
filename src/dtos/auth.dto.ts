import { IsNotEmpty, IsString } from "class-validator";
import { VALIDATION_ERROR } from "env";



export class AuthDTO {
  @IsString()
  @IsNotEmpty({ message: VALIDATION_ERROR })
  email: string;
}