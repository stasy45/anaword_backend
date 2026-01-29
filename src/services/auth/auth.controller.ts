import { Body, Controller, Get, Post, Res, Req, UsePipes, ValidationPipe, UseGuards } from "@nestjs/common";
import { Response, Request } from 'express';
import * as crypto from 'crypto';
import { AuthDTO } from "src/dtos/auth.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/guards/common";
import { COOKIE_SECRET } from "src/env";



@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }

  @UseGuards(AuthGuard)
  @Get('session/check')
  async getCheckSession(@Req() req: Request): Promise<void> {
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async postLogin(
    @Body() body: AuthDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const userId = await this.authService.login(body.email)

    const signedUserId = userId + '.' + crypto
      .createHmac('sha256', COOKIE_SECRET)
      .update(userId.toString())
      .digest('hex');

    res.cookie('userId', signedUserId, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return true
  }


}