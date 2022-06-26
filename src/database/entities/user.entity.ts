import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '@models/role.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: Role;

  @Column()
  avatar: string;
}
