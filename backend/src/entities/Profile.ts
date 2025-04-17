import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user!: User;

  @Column({ nullable: true })
  firstName!: string;

  @Column({ nullable: true })
  lastName!: string;

  @Column('text', { array: true, nullable: true })
  skills!: string[]; // List of user skills (e.g., ['JavaScript', 'React'])

  @Column({ nullable: true })
  experienceLevel!: string; // Example: 'Junior', 'Mid', 'Senior'

  @Column('text', { array: true, nullable: true })
  jobTypes!: string[]; // Example: ['Full-time', 'Part-time', 'Freelance']

  @Column({ nullable: true })
  bio!: string;

  @Column({ nullable: true })
  location!: string;
}