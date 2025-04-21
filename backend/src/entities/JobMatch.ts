import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Job } from './Job';

@Entity()
export class JobMatch {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.id)
  jobSeeker!: User;

  @ManyToOne(() => Job, (job) => job.id)
  job!: Job;

  @CreateDateColumn()
  matchedAt!: Date;
}