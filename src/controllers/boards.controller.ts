import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  ParseIntPipe,
  UseGuards,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BoardService } from '@services/board.service';
import { UpdateBoardDto, CreateBoardDto } from '@dtos/board.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@guards/roles.decorator';
import { Role } from '@models/role.model';

@ApiTags('boards')
@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAll() {
    return this.boardService.getAll();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  getBoardsByUser() {
    return this.boardService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  get(@Param('id', ParseIntPipe) id: number) {
    return this.boardService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  create(@Body() dto: CreateBoardDto) {
    return this.boardService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBoardDto) {
    return this.boardService.update(id, dto);
  }
}
