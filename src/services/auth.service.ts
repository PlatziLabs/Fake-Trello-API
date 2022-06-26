import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '@services/users.service';
import { TokenPayload } from '@models/token.model';
import { User } from '@db/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async isAvailable(email: string) {
    try {
      await this.usersService.findByEmail(email);
      return {
        isAvailable: false,
      };
    } catch (error) {
      return {
        isAvailable: true,
      };
    }
  }

  generateJWT(user: User) {
    const payload: TokenPayload = { userId: user.id };
    return this.jwtService.sign(payload);
  }
}
