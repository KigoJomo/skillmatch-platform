import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class AuthSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.id)
  user!: User;

  @Column()
  refreshToken!: string; // Store the refresh token for session management

  @Column()
  ipAddress!: string; // IP address of the client device

  @Column()
  userAgent!: string; // Information about the client device (e.g., browser, OS)

  @Column({ type: 'timestamp' })
  expiresAt!: Date; // Token expiration time

  @CreateDateColumn()
  createdAt!: Date;
}