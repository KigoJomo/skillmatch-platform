import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Application } from './Application';

export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive',
}

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  company: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  salary: string;

  @Column({
    type: 'enum',
    enum: JobType,
    default: JobType.FULL_TIME,
  })
  jobType: JobType;

  @Column({
    type: 'enum',
    enum: ExperienceLevel,
    default: ExperienceLevel.ENTRY,
  })
  experienceLevel: ExperienceLevel;

  @Column('simple-array')
  requiredSkills: string[];

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.postedJobs)
  postedBy: User;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
