import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDTO';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser, type JwtUserPayload } from '../auth/customDecorator/currentUser.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUserProfile(@CurrentUser() user: JwtUserPayload) {
    return this.usersService.getUserProfile(user.userId);
  }
}
