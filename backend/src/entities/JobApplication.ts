import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Job } from './Job';

@Entity()
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.id)
  applicant!: User;

  @ManyToOne(() => Job, (job) => job.id)
  job!: Job;

  @Column('text')
  coverLetter!: string;

  @Column({ default: 'Pending' })
  status!: 'Pending' | 'Accepted' | 'Rejected';

  @CreateDateColumn()
  appliedAt!: Date;
}