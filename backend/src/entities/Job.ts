import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

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

  @Column({ nullable: true })
  salaryRange!: string;

  @ManyToOne(() => User, (user) => user.id)
  recruiter!: User;

  @Column('simple-array', { nullable: true })
  requiredSkills!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
