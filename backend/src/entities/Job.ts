import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { JobApplication } from './JobApplication';
import { JobMatch } from './JobMatch';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column()
  location!: string;

  @Column()
  department!: string;

  @Column()
  employmentType!: string;

  @Column({ nullable: true })
  salaryRange!: string;

  @Column('text')
  experience!: string;

  @Column('text')
  education!: string;

  @Column('text')
  benefits!: string;

  @Column()
  workingHours!: string;

  @Column('simple-array')
  requiredSkills!: string[];

  @Column({ default: 'draft' })
  status!: 'draft' | 'active' | 'closed';

  @ManyToOne(() => User, (user) => user.jobs)
  recruiter!: User;

  @OneToMany(() => JobApplication, (application) => application.job)
  applications!: JobApplication[];

  @OneToMany(() => JobMatch, (match) => match.job)
  matches!: JobMatch[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
