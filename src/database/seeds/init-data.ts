import { dataSource } from '@db/orm-cli';
import { User } from '@db/entities/user.entity';
import { generateManyUsers } from '@db/entities/user.seed';

(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
  await dataSource.synchronize();

  const userRepo = dataSource.getRepository(User);
  const users = generateManyUsers();
  userRepo.insert(users);
})();
