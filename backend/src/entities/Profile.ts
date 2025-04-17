import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  phone: string;

  @Column('simple-array', { nullable: true })
  skills: string[];

  @Column({ nullable: true })
  experienceLevel: string;

  @Column('simple-array', { nullable: true })
  jobTypes: string[];

  @Column({ nullable: true })
  salaryExpectation: string;

  @Column({ nullable: true })
  preferredLocation: string;

  @Column({ nullable: true })
  location: string;

  @Column('simple-json', { nullable: true })
  experience: {
    company: string;
    title: string;
    description: string;
    startDate: string;
    endDate?: string;
  }[];

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  resumeUrl: string;

  @Column({ nullable: true })
  linkedIn: string;

  @Column({ nullable: true })
  github: string;

  @Column({ nullable: true })
  website: string;

  // For employers
  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  companySize: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  workLocations: string;

  @Column({ nullable: true })
  interviewProcess: string;

  @Column({ nullable: true })
  benefits: string;

  @Column({ nullable: true })
  salaryRange: string;

  @Column({ default: false })
  onboardingCompleted: boolean;
}
