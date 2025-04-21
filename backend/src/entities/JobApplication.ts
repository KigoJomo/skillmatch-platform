import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Job } from './Job';

@Entity()
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.applications)
  applicant!: User;

  @ManyToOne(() => Job, (job) => job.applications)
  job!: Job;

  @Column('text')
  coverLetter!: string;

  @Column({ default: 'Pending' })
  status!: 'Pending' | 'Accepted' | 'Rejected';

  @Column({ type: 'float', default: 0 })
  matchPercentage!: number;

  @CreateDateColumn()
  appliedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
