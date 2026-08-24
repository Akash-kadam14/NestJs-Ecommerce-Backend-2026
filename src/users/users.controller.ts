import { Body, Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDTO';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUserProfile(@Request() req) {
    return this.usersService.getUserProfile(req.user.sub);
  }
}
