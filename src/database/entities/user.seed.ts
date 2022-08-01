import { faker } from '@faker-js/faker/locale/es';

import { User } from '@db/entities/user.entity';
import { Role } from '@models/role.model';
import { generateImage } from '@utils/generate-img';

type NewUser = Omit<
  User,
  'id' | 'creationAt' | 'updatedAt' | 'boards' | 'cards'
>;

export const generateOneUser = (): NewUser => {
  return {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: Role.USER,
    avatar: generateImage('face'),
    recoveryToken: null,
  };
};

export const generateManyUsers = (size = 10): NewUser[] => {
  const users: NewUser[] = [];
  for (let index = 0; index < size; index++) {
    users.push(generateOneUser());
  }
  return [...users];
};
