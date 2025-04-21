// src/data-source.ts

import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Profile } from './entities/Profile';
import { ChatSession } from './entities/ChatSession';
import { AuthSession } from './entities/AuthSession';
import { Application } from './entities/Application';
import 'dotenv/config';
import { Job } from './entities/Job';
import { JobApplication } from './entities/JobApplication';
import { JobMatch } from './entities/JobMatch';

const database_url = process.env.DATABASE_URL!;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: database_url,
  synchronize: false,
  logging: false,
  entities: [
    Application,
    AuthSession,
    ChatSession,
    Job,
    JobApplication,
    JobMatch,
    Profile,
    User,
  ],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
