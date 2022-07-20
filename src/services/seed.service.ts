import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@db/entities/user.entity';
import { generateManyUsers, generateOneUser } from '@db/entities/user.seed';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async init() {
    const usersV1: Omit<User, 'id'>[] = [
      {
        ...generateOneUser(),
        name: 'Admin Perez',
        email: 'admin@mail.com',
        password: 'changeme',
      },
      {
        ...generateOneUser(),
        name: 'Nicolas Molina',
        email: 'nicolas@mail.com',
        password: 'changeme',
      },
    ];
    const usersV2 = generateManyUsers(5);
    await this.usersRepo.insert([...usersV1, ...usersV2]);
    return true;
  }
}
