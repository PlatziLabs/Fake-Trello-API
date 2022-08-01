import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker/locale/es';
import * as bcrypt from 'bcrypt';

import { User } from '@db/entities/user.entity';
import { Board } from '@db/entities/board.entity';
import { List } from '@db/entities/list.entity';
import { Card } from '@db/entities/card.entity';
import { generateOneUser } from '@db/entities/user.seed';
import { Role } from '@models/role.model';
import { Colors } from '@models/colors.model';

@Injectable()
export class SeedService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async init() {
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();

    // -------- REPOS --------

    const userRepo = this.dataSource.getRepository(User);
    const boardsRepo = this.dataSource.getRepository(Board);
    const listsRepo = this.dataSource.getRepository(List);
    const cardsRepo = this.dataSource.getRepository(Card);

    // -------- USERS --------

    const adminPassword = await bcrypt.hash('changeme', 10);
    const adminUserData = userRepo.create({
      ...generateOneUser(),
      name: 'Admin',
      email: 'admin@admin.com',
      role: Role.ADMIN,
      password: adminPassword,
    });
    await userRepo.save(adminUserData);

    const nicoPassword = await bcrypt.hash('changeme', 10);
    const nicoUserData = userRepo.create({
      ...generateOneUser(),
      role: Role.USER,
      name: 'Nicolas Molina',
      email: 'nicolas@mail.com',
      password: nicoPassword,
    });
    const nicoUser = await userRepo.save(nicoUserData);

    const santiPassword = await bcrypt.hash('changeme', 10);
    const santiUserData = userRepo.create({
      ...generateOneUser(),
      role: Role.USER,
      name: 'Santiago Molina',
      email: 'santiago@mail.com',
      password: santiPassword,
    });
    const santiUser = await userRepo.save(santiUserData);

    const valePassword = await bcrypt.hash('changeme', 10);
    const valeUserData = userRepo.create({
      ...generateOneUser(),
      role: Role.USER,
      name: 'Valentina Molina',
      email: 'valentina@mail.com',
      password: valePassword,
    });
    const valeUser = await userRepo.save(valeUserData);

    console.log('users loaded');

    // -------- BOARDS --------

    const board1Data = boardsRepo.create({
      title: 'Board 1',
      backgroundColor: Colors.Sky,
      members: [nicoUser, santiUser, valeUser],
    });
    const board1 = await boardsRepo.save(board1Data);

    const board2Data = boardsRepo.create({
      title: 'Board 2',
      backgroundColor: Colors.Green,
      members: [nicoUser, santiUser, valeUser],
    });
    const board2 = await boardsRepo.save(board2Data);

    const board3Data = boardsRepo.create({
      title: 'Board 3',
      backgroundColor: Colors.Violet,
      members: [nicoUser, santiUser, valeUser],
    });
    const board3 = await boardsRepo.save(board3Data);

    const board4Data = boardsRepo.create({
      title: 'Board 4',
      backgroundColor: Colors.Yellow,
      members: [nicoUser, santiUser, valeUser],
    });
    const board4 = await boardsRepo.save(board4Data);

    console.log('boards loaded');

    // -------- LISTS --------

    const list1Data = listsRepo.create({
      title: 'ToDo',
      position: 1,
      board: board1,
    });
    const list1 = await listsRepo.save(list1Data);

    const list2Data = listsRepo.create({
      title: 'Doing',
      position: 2,
      board: board1,
    });
    const list2 = await listsRepo.save(list2Data);

    const list3Data = listsRepo.create({
      title: 'Done',
      position: 3,
      board: board1,
    });
    const list3 = await listsRepo.save(list3Data);

    console.log('lists loaded');

    // -------- CARDS --------

    const card1Data = cardsRepo.create({
      title: 'Make dishes',
      description: faker.lorem.paragraphs(2),
      position: 1,
      members: [valeUser],
      board: board1,
      list: list1,
    });
    await cardsRepo.save(card1Data);

    const card2Data = cardsRepo.create({
      title: 'Buy a unicorn',
      description: faker.lorem.paragraphs(2),
      position: 2,
      board: board1,
      list: list1,
    });
    await cardsRepo.save(card2Data);

    const card3Data = cardsRepo.create({
      title: 'Watch Angular Path in Platzi',
      description: faker.lorem.paragraphs(2),
      position: 3,
      board: board1,
      list: list2,
    });
    await cardsRepo.save(card3Data);

    const card4Data = cardsRepo.create({
      title: 'Play video games',
      description: faker.lorem.paragraphs(2),
      position: 4,
      board: board1,
      list: list3,
    });
    await cardsRepo.save(card4Data);

    console.log('cards loaded');

    // -------- COUNTERS --------

    const users = await userRepo.find();
    const boards = await boardsRepo.find();
    const cards = await cardsRepo.find();

    return {
      users: users.length,
      boards: boards.length,
      cards: cards.length,
    };
  }
}
