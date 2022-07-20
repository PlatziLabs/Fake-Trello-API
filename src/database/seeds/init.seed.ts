import { dataSource } from '@db/orm-cli';
import { User } from '@db/entities/user.entity';
import { generateManyUsers, generateOneUser } from '@db/entities/user.seed';

export const initSeed = async () => {
  try {
    await dataSource.dropDatabase();

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
    return true;
  } catch (error) {
    throw Error(error);
  }
};

(async () => {
  await initSeed();
})();
