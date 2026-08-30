import { Controller, Post, Body, Headers, Res, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CurrentUser, type JwtUserPayload } from './customDecorator/currentUser.decorator';


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
    @Res({ passthrough: true }) res: express.Response
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

  @Post('logout/one-device')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: JwtUserPayload,
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const { userId, sessionId } = user;
    await this.authService.logout(userId, sessionId);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { message: 'logged out successfully' }

  }

  @Post('logout/all-device')
  @UseGuards(JwtAuthGuard)
  async logoutFromAllDevice(
    @CurrentUser() user: JwtUserPayload,
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const { userId } = user;
    await this.authService.logoutFromAllDevice(userId);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: 'logged out from all devices successfully' }
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response
  ) {

    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const newAccessToken = await this.authService.refreshToken(refreshToken);
      return { newAccessToken }
    } catch (error) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      throw new UnauthorizedException(error.message);
    }
  }

}
