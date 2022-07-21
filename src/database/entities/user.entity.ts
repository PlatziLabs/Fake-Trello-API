import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '@models/role.model';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  role: Role;

  @Column()
  avatar: string;
}
