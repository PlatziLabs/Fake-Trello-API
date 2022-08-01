import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Card } from '@db/entities/card.entity';
import { Board } from '@db/entities/board.entity';

@Entity()
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

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

  @OneToMany(() => Card, (card) => card.list)
  cards: Card[];

  @ManyToOne(() => Board, (board) => board.lists)
  @JoinColumn({ name: 'board_id' })
  board: Board;
}
