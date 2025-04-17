import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User';
// import { ChatMessage } from './ChatMessage';

@Entity()
export class ChatSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.chatSessions)
  user!: User;

  @CreateDateColumn()
  sessionStart!: Date;

  @Column('json', { nullable: true })
  context!: object;

  // @OneToMany(() => ChatMessage, (message) => message.session, { cascade: true })
  // messages!: ChatMessage[];
}