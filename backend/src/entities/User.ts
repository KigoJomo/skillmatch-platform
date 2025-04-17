import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Profile } from "./Profile";
import { ChatSession } from "./ChatSession";
import { Application } from "./Application";

export enum UserRole{
  SEEKER = 'seeker',
  EMPLOYER = 'employer'
}

export enum OnboardingStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity()
export class User{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string; // Store the hashed version of the password

  @Column({ type: 'enum', enum: UserRole, default: UserRole.SEEKER })
  role!: UserRole;

  @Column({ type: 'enum', enum: OnboardingStatus, default: OnboardingStatus.NOT_STARTED })
  onboardingStatus!: OnboardingStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile!: Profile;

  @OneToMany(() => ChatSession, (chatSession) => chatSession.user)
  chatSessions!: ChatSession[];

  @OneToMany(() => Application, (application) => application.user)
  applications!: Application[];
}