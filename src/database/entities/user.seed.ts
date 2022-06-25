import { faker } from '@faker-js/faker/locale/es';

import { User, Role } from './user.entity';
import { generateImage } from '@utils/generate-img';

export const generateOneUser = (): Partial<User> => {
  return {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: Role.admin,
    avatar: generateImage('face'),
  };
};

export const generateManyUsers = (size = 10): Partial<User>[] => {
  const users: Partial<User>[] = [];
  for (let index = 0; index < size; index++) {
    users.push(generateOneUser());
  }
  return [...users];
};
