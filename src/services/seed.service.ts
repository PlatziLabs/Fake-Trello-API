import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '@db/entities/user.entity';
import { generateOneUser } from '@db/entities/user.seed';
import { Role } from '@models/role.model';

@Injectable()
export class SeedService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async init() {
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();

    const userRepo = this.dataSource.getRepository(User);
    const adminPassword = await bcrypt.hash('changeme', 10);
    const adminUser = {
      ...generateOneUser(),
      name: 'Admin',
      email: 'admin@admin.com',
      role: Role.ADMIN,
      password: adminPassword,
    };

    const nicoPassword = await bcrypt.hash('changeme', 10);
    const nicoUser = {
      ...generateOneUser(),
      role: Role.USER,
      name: 'Nicolas Molina',
      email: 'nicolas@mail.com',
      password: nicoPassword,
    };

    const santiPassword = await bcrypt.hash('changeme', 10);
    const santiUser = {
      ...generateOneUser(),
      role: Role.USER,
      name: 'Santiago Molina',
      email: 'santiago@mail.com',
      password: santiPassword,
    };

    const valePassword = await bcrypt.hash('changeme', 10);
    const valeUser = {
      ...generateOneUser(),
      role: Role.USER,
      name: 'Valentina Molina',
      email: 'valentina@mail.com',
      password: valePassword,
    };
    await userRepo.insert([adminUser, nicoUser, santiUser, valeUser]);
    const users = await userRepo.find();
    return {
      users: users.length,
    };
  }
}
