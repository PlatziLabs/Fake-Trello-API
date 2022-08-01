import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { List } from '@db/entities/list.entity';
import { Board } from '@db/entities/board.entity';
import { User } from '@db/entities/user.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'int' })
  position: number;

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

  @ManyToOne(() => List, (list) => list.cards)
  @JoinColumn({ name: 'list_id' })
  list: List;

  @ManyToOne(() => Board, (board) => board.cards)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @ManyToMany(() => User, (user) => user.cards)
  @JoinTable({
    name: 'cards_users',
    joinColumn: {
      name: 'card_id',
    },
    inverseJoinColumn: {
      name: 'user_id',
    },
  })
  members: User[];
}
