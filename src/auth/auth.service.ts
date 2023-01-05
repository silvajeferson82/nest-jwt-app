import { Body, Injectable } from '@nestjs/common';
import { UsersService } from '../app/users/users.service';
import { UsersEntity } from '../app/users/entities/users.entity';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user) {
    const payload = { sub: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(@Body() email: string, password: string) {
    let user: UsersEntity;
    try {
      user = await this.userService.findOneOrFail(null, email);
    } catch (error) {
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
}
