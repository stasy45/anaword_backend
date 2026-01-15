import { Response, Request } from 'express';
import { AuthDTO } from "src/dtos/auth.dto";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    getCheckSession(req: Request): Promise<void>;
    postLogin(body: AuthDTO, res: Response): Promise<boolean>;
}
