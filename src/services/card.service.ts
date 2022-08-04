import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Card } from '@db/entities/card.entity';
import { Board } from '@db/entities/board.entity';
import { List } from '@db/entities/list.entity';
import { User } from '@db/entities/user.entity';
import { CreateCardDto, UpdateCardDto } from '@dtos/card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardsRepo: Repository<Card>,
    @InjectRepository(Board)
    private boardsRepo: Repository<Board>,
    @InjectRepository(List)
    private listsRepo: Repository<List>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  findById(id: Card['id']) {
    return this.cardsRepo.findOneByOrFail({ id });
  }

  async create(userId: User['id'], dto: CreateCardDto) {
    const user = await this.usersRepo.findOneByOrFail({ id: userId });
    const newCard = this.cardsRepo.create(dto);
    newCard.members = [user];
    const board = await this.boardsRepo.findOneByOrFail({ id: dto.boardId });
    newCard.board = board;
    const list = await this.listsRepo.findOneByOrFail({ id: dto.listId });
    newCard.list = list;
    return this.cardsRepo.save(newCard);
  }

  async update(id: Card['id'], changes: UpdateCardDto) {
    const card = await this.findById(id);
    this.cardsRepo.merge(card, changes);
    if (changes?.boardId) {
      const board = await this.boardsRepo.findOneByOrFail({
        id: changes?.boardId,
      });
      card.board = board;
    }
    if (changes?.listId) {
      const list = await this.listsRepo.findOneByOrFail({
        id: changes?.listId,
      });
      card.list = list;
    }
    return this.cardsRepo.save(card);
  }
}
