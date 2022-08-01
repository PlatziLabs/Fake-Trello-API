import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Role } from '@models/role.model';
import { Board } from '@db/entities/board.entity';
import { Card } from '@db/entities/card.entity';
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

  @Exclude()
  @Column()
  role: Role;

  @Column()
  avatar: string;

  @Exclude()
  @Column({ nullable: true, name: 'recovery_token' })
  recoveryToken: string | null;

  @CreateDateColumn({
    name: 'creation_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  creationAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToMany(() => Board, (board) => board.members)
  boards: Board[];

  @ManyToMany(() => Card, (card) => card.members)
  cards: Card[];
}
