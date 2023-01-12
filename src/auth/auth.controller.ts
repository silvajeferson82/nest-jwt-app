import { Controller, Post, Req, Body, UseGuards, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../app/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../app/users/users.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('/signup')
  async store(@Body() body: CreateUserDto) {
    return await this.userService.store(body);
  }

  @Patch('/reset_token')
  createResetToken(@Body('email') email: string) {
    return this.userService.createResetToken(email);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any) {
    return await this.authService.login(req.user);
  }
}
