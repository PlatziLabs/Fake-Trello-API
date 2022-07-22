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
    return this.jwtService.sign(payload, {
      expiresIn: '5h',
      secret: this.configService.accessSecretKey,
    });
  }

  generateRefreshToken(user: User) {
    const payload: TokenPayload = { userId: user.id };
    return this.jwtService.sign(payload, {
      expiresIn: '10h',
      secret: this.configService.refreshSecretKey,
    });
  }

  async sendRecovery(email: string) {
    const user = await this.findByEmail(email);
    const payload = { sub: user.id };
    const recoveryToken = this.jwtService.sign(payload, {
      expiresIn: '5m',
      secret: this.configService.recoverySecretKey,
    });
    const link = `http://myfrontend.com/recovery?token=${recoveryToken}`;
    user.recoveryToken = recoveryToken;
    await this.usersRepo.save(user);
    // send email
    return {
      link,
      recoveryToken,
    };
  }

  findByEmail(email: string) {
    return this.usersRepo.findOneByOrFail({ email });
  }

  findUserById(id: User['id']) {
    return this.usersRepo.findOneByOrFail({ id });
  }

  async changePassword(recoveryToken: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(recoveryToken, {
        secret: this.configService.recoverySecretKey,
      });
      const user = await this.findUserById(payload.sub);
      if (user.email === 'nicolas@mail.com') {
        throw new UnauthorizedException(
          'Invalid change password to nicolas@mail.com',
        );
      }
      if (user.recoveryToken !== recoveryToken) {
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

  async generateAccessTokenByRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.refreshSecretKey,
      });
      const user = await this.findUserById(payload.sub);
      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);
      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid');
    }
  }
}
