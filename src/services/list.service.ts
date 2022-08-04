import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Card } from '@db/entities/card.entity';
import { Board } from '@db/entities/board.entity';
import { List } from '@db/entities/list.entity';
import { User } from '@db/entities/user.entity';
import { CreateListDto } from '@dtos/list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(Board)
    private boardsRepo: Repository<Board>,
    @InjectRepository(List)
    private listsRepo: Repository<List>,
  ) {}

  async create(dto: CreateListDto) {
    const newList = this.listsRepo.create(dto);
    const board = await this.boardsRepo.findOneByOrFail({ id: dto.boardId });
    newList.board = board;
    return this.listsRepo.save(newList);
  }
}
