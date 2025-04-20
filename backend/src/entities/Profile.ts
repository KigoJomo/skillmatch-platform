import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
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

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  website!: string;

  @Column('text', { array: true, nullable: true })
  skills!: string[];

  @Column({ nullable: true })
  experienceLevel!: string;

  @Column('text', { array: true, nullable: true })
  jobTypes!: string[];

  @Column({ nullable: true })
  bio!: string;

  @Column({ nullable: true })
  location!: string;

  @Column({ nullable: true })
  salaryExpectation!: string;

  @Column({ nullable: true })
  preferredLocation!: string;

  @Column({ nullable: true })
  companySize!: string;

  @Column({ nullable: true })
  industry!: string;

  @Column({ nullable: true })
  interviewProcess!: string;

  @Column({ nullable: true })
  benefits!: string;

  @Column({ nullable: true })
  workLocations!: string;

  @Column({ nullable: true })
  salaryRange!: string;
}
