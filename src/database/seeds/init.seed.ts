import { dataSource } from '@db/orm-cli';
import { User } from '@db/entities/user.entity';
import { generateManyUsers, generateOneUser } from '@db/entities/user.seed';

const initSeed = async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
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
  const users = await userRepo.find();
  console.log('USERS =>', users.length);
};

(async () => {
  await initSeed();
})();
