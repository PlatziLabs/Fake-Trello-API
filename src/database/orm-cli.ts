import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ENTITIES } from '@db/entities';

export const dataSource = new DataSource({
  type: 'better-sqlite3',
  database: ':memory:',
  synchronize: true,
  logging: true,
  entities: [...ENTITIES],
  migrations: ['./src/database/migrations'],
});
