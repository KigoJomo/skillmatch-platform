import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Profile } from "./Profile";
import { ChatSession } from "./ChatSession";
import { Application } from "./Application";

export enum UserRole{
  SEEKER = 'Job Seeker',
  EMPLOYER = 'Employer/Recruiter'
}

@Entity()
export class User{
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

  @OneToMany(() => Application, (application) => application.user)
  applications!: Application[];
}