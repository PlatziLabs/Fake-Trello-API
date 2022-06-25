import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@db/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  getAll() {
    return this.usersRepo.find();
  }

  findByEmail(email: string) {
    return this.usersRepo.findOneBy({ email });
  }
}
