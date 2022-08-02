import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Card } from '@db/entities/card.entity';
import { Board } from '@db/entities/board.entity';
import { List } from '@db/entities/list.entity';
import { CreateCardDto, UpdateCardDto } from '@dtos/card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardsRepo: Repository<Card>,
    @InjectRepository(Board)
    private boardsRepo: Repository<Board>,
    @InjectRepository(List)
    private listRepo: Repository<List>,
  ) {}

  findById(id: Card['id']) {
    return this.cardsRepo.findOneByOrFail({ id });
  }

  async create(dto: CreateCardDto) {
    const newCard = this.cardsRepo.create(dto);
    const board = await this.boardsRepo.findOneByOrFail({ id: dto.boardId });
    newCard.board = board;
    const list = await this.listRepo.findOneByOrFail({ id: dto.listId });
    newCard.list = list;
    return this.cardsRepo.save(newCard);
  }

  async update(id: Card['id'], changes: UpdateCardDto) {
    const card = await this.findById(id);
    if (changes?.boardId) {
      const board = await this.boardsRepo.findOneByOrFail({
        id: changes?.boardId,
      });
      card.board = board;
    }
    if (changes?.listId) {
      const list = await this.listRepo.findOneByOrFail({
        id: changes?.listId,
      });
      card.list = list;
    }
    this.cardsRepo.merge(card, changes);
    return this.cardsRepo.save(card);
  }
}
