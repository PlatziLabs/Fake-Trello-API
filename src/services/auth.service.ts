import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import config from '@config/config';
import * as bcrypt from 'bcrypt';

import { Repository } from 'typeorm';
import { TokenPayload } from '@models/token.model';
import { User } from '@db/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const rtaUser = { ...user };
        delete rtaUser.password;
        delete rtaUser.recoveryToken;
        return rtaUser;
      }
    }
    return null;
  }

  async isAvailable(email: string) {
    try {
      await this.findByEmail(email);
      return {
        isAvailable: false,
      };
    } catch (error) {
      return {
        isAvailable: true,
      };
    }
  }

  generateAccessToken(user: User) {
    const payload: TokenPayload = { userId: user.id };
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(token: string) {
    return this.jwtService.sign({ token });
  }

  async sendRecovery(email: string) {
    const user = await this.findByEmail(email);
    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload, {
      expiresIn: '5m',
      secret: this.configService.recoverySecretKey,
    });
    const link = `http://myfrontend.com/recovery?token=${token}`;
    user.recoveryToken = token;
    await this.usersRepo.save(user);
    // send email
    return {
      link,
      token,
    };
  }

  findByEmail(email: string) {
    return this.usersRepo.findOneByOrFail({ email });
  }

  findUserById(id: User['id']) {
    return this.usersRepo.findOneByOrFail({ id });
  }

  async changePassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.recoverySecretKey,
      });
      const user = await this.findUserById(payload.sub);
      if (user.recoveryToken !== token) {
        throw new UnauthorizedException('Invalid');
      }
      const hash = await bcrypt.hash(newPassword, 10);
      user.recoveryToken = null;
      user.password = hash;
      await this.usersRepo.save(user);
      return { message: 'password changed' };
    } catch (error) {
      throw new UnauthorizedException('Invalid');
    }
  }
}
