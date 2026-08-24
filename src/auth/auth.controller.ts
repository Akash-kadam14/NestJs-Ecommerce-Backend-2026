import { Controller, Post, Body, Headers, Res } from '@nestjs/common';
import * as express from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(
    @Headers('user-agent') userAgent: string,
    @Body() loginDto: LoginDto,
    // { passthrough: true } allows you to set cookies on res and still return a value from the controller.
    // Without { passthrough: true }, if you call res.cookie(), NestJS assumes you are taking over the entire response handling, 
    // and it will not automatically send the value you return from the controller.
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(loginDto, userAgent);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });
    return { accessToken };
  }
}
