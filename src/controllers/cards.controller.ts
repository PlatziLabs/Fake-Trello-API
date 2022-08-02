import {
  Controller,
  UseGuards,
  Post,
  Body,
  Put,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CardService } from '@services/card.service';
import { CreateCardDto, UpdateCardDto } from '@dtos/card.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@guards/roles.decorator';
import { Role } from '@models/role.model';

@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(private cardService: CardService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  create(@Body() dto: CreateCardDto) {
    return this.cardService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCardDto) {
    return this.cardService.update(id, dto);
  }
}
