// src/data-source.ts

import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Profile } from './entities/Profile';
import { ChatSession } from './entities/ChatSession';
import { AuthSession } from './entities/AuthSession';
import { Application } from './entities/Application';
import "dotenv/config"

const database_url = process.env.DATABASE_URL!;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: database_url,
  synchronize: false,
  logging: false,
  entities: [User, Profile, ChatSession, AuthSession, Application],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations'
});
