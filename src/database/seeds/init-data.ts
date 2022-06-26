import { dataSource } from '@db/orm-cli';
import * as fs from 'fs';
import { User } from '@db/entities/user.entity';
import { generateManyUsers, generateOneUser } from '@db/entities/user.seed';

(async () => {
  fs.rmSync('./db', { recursive: true });
  fs.rmSync('./db-shm', { recursive: true });
  fs.rmSync('./db-wal', { recursive: true });
  await dataSource.initialize();
  await dataSource.synchronize();

  const userRepo = dataSource.getRepository(User);
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

  await dataSource.destroy();
})();
