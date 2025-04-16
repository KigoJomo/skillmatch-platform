import { DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false, // set true for dev only
  logging: false,
  entities: [join(__dirname, 'entities', '*.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  ssl: {
    rejectUnauthorized: false, // Required for Neon Postgres
  },
};

export default config;
