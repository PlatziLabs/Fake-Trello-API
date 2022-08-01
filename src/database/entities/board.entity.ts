import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Colors } from '@models/colors.model';
import { User } from '@db/entities/user.entity';
import { Card } from '@db/entities/card.entity';
import { List } from '@db/entities/list.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    name: 'background_color',
  })
  backgroundColor: Colors;

  @ManyToMany(() => User, (user) => user.boards)
  @JoinTable({
    name: 'boards_users',
    joinColumn: {
      name: 'board_id',
    },
    inverseJoinColumn: {
      name: 'user_id',
    },
  })
  members: User[];

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

  @OneToMany(() => Card, (card) => card.board)
  cards: Card[];

  @OneToMany(() => List, (list) => list.board)
  lists: List[];
}
