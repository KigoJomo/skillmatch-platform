// src/data-source.ts

import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Profile } from './entities/Profile';
import { ChatSession } from './entities/ChatSession';
import { AuthSession } from './entities/AuthSession';
import 'dotenv/config';
import { Job } from './entities/Job';
import { JobApplication } from './entities/JobApplication';
import { JobMatch } from './entities/JobMatch';
import { Project } from './entities/Project';

const database_url = process.env.DATABASE_URL!;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: database_url,
  synchronize: false,
  logging: false,
  entities: [
    AuthSession,
    ChatSession,
    Job,
    JobApplication,
    JobMatch,
    Profile,
    Project,
    User,
  ],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
