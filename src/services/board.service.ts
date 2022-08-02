import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Board } from '@db/entities/board.entity';
import { CreateBoardDto, UpdateBoardDto } from '@dtos/board.dto';
import { User } from '@db/entities/user.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardsRepo: Repository<Board>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  findById(id: Board['id']) {
    return this.boardsRepo.findOneOrFail({
      where: {
        id,
      },
      order: {
        lists: {
          position: 'ASC',
          cards: {
            position: 'ASC',
          },
        },
        cards: {
          position: 'ASC',
        },
      },
      relations: ['members', 'lists', 'lists.cards', 'cards.list'],
    });
  }

  async findByUserId(id: User['id']) {
    const user = await this.usersRepo.findOneByOrFail({ id });
    return this.boardsRepo.find({
      relations: ['members'],
      where: {
        members: {
          id: user.id,
        },
      },
    });
  }

  getAll() {
    return this.boardsRepo.find({
      relations: ['members'],
    });
  }

  async create(dto: CreateBoardDto) {
    const newBoard = this.boardsRepo.create(dto);
    return this.boardsRepo.save(newBoard);
  }

  async update(id: Board['id'], changes: UpdateBoardDto) {
    const board = await this.findById(id);
    this.boardsRepo.merge(board, changes);
    return this.boardsRepo.save(board);
  }
}
