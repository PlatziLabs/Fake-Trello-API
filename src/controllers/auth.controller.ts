import { Controller, Post, UseGuards, Req, Get, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from '@services/auth.service';
import { UsersService } from '@services/users.service';
import { TokenPayload } from '@models/token.model';
import { User } from '@db/entities/user.entity';
import { CheckEmailDto, ChangePasswordDto } from '@dtos/auth.dto';
import { CreateUserDto } from '@dtos/user.dto';
import { LocalAuthGuard } from '@guards/local-auth.guard';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@guards/roles.decorator';
import { Role } from '@models/role.model';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req: Request) {
    const user = req.user as User;
    const token = this.authService.generateAccessToken(user);
    return {
      access_token: token,
      refresh_token: this.authService.generateRefreshToken(token),
    };
  }

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('is-available')
  checkEmail(@Body() dto: CheckEmailDto) {
    return this.authService.isAvailable(dto.email);
  }

  @Post('recovery')
  recovery(@Body() dto: CheckEmailDto) {
    return this.authService.sendRecovery(dto.email);
  }

  @Post('change-password')
  changePassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(dto.token, dto.newPassword);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  profile(@Req() req: Request) {
    const user = req.user as TokenPayload;
    return this.usersService.findUserById(user?.userId);
  }
}
