import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './Profile';
import { ChatSession } from './ChatSession';
import { JobApplication } from './JobApplication';
import { Project } from './Project';
import { Job } from './Job';

export enum UserRole {
  SEEKER = 'Job Seeker',
  EMPLOYER = 'Employer/Recruiter',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.SEEKER })
  role!: UserRole;

  @Column({ type: 'boolean', default: false })
  onboardingCompleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile!: Profile;

  @OneToMany(() => ChatSession, (chatSession) => chatSession.user)
  chatSessions!: ChatSession[];

  @OneToMany(() => JobApplication, (application) => application.applicant)
  applications!: JobApplication[];

  @OneToMany(() => Project, (project) => project.user)
  projects!: Project[];

  @OneToMany(() => Job, (job) => job.recruiter)
  jobs!: Job[];
}
