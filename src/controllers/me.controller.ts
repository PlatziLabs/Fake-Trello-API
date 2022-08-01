import { Controller, UseGuards, Req, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { UsersService } from '@services/users.service';
import { BoardService } from '@services/board.service';
import { TokenPayload } from '@models/token.model';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@guards/roles.decorator';
import { Role } from '@models/role.model';

@ApiTags('me')
@Controller('me')
export class MeController {
  constructor(
    private usersService: UsersService,
    private boardsService: BoardService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  profile(@Req() req: Request) {
    const user = req.user as TokenPayload;
    return this.usersService.findUserById(user?.userId);
  }

  @Get('boards')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  getBoards(@Req() req: Request) {
    const user = req.user as TokenPayload;
    return this.boardsService.findByUserId(user?.userId);
  }
}
