import { Controller, Body, UseGuards, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ListService } from '@services/list.service';
import { CreateListDto } from '@dtos/list.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@guards/roles.decorator';
import { Role } from '@models/role.model';

@ApiTags('lists')
@Controller('lists')
export class ListController {
  constructor(private listService: ListService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  create(@Body() dto: CreateListDto) {
    return this.listService.create(dto);
  }
}
