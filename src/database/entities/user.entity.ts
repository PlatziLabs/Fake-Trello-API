import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  admin = 'admin',
  customer = 'customer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: Role;

  @Column()
  avatar: string;
}
