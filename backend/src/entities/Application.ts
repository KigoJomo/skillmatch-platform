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

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  INTERVIEWED = 'interviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.applications)
  user: User;

  @ManyToOne(() => Job, (job) => job.applications)
  job: Job;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column('text', { nullable: true })
  coverLetter: string;

  @Column({ nullable: true })
  resumeUrl: string;

  @Column('simple-json', { nullable: true })
  answers: {
    question: string;
    answer: string;
  }[];

  @Column('float', { nullable: true })
  matchScore: number;

  @CreateDateColumn()
  appliedDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
