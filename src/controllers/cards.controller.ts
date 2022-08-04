import {
  Controller,
  UseGuards,
  Post,
  Body,
  Put,
  ParseIntPipe,
  Param,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

import { CardService } from '@services/card.service';
import { CreateCardDto, UpdateCardDto } from '@dtos/card.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@guards/roles.decorator';
import { Role } from '@models/role.model';
import { TokenPayload } from '@models/token.model';

@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(private cardService: CardService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  create(@Req() req: Request, @Body() dto: CreateCardDto) {
    const user = req.user as TokenPayload;
    return this.cardService.create(user.userId, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCardDto) {
    return this.cardService.update(id, dto);
  }
}
