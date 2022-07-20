import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { User } from '@db/entities/user.entity';
import { generateManyUsers, generateOneUser } from '@db/entities/user.seed';

@Injectable()
export class SeedService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async init() {
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();

    const userRepo = this.dataSource.getRepository(User);
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
    await userRepo.insert([...usersV1, ...usersV2]);
    return true;
  }
}
