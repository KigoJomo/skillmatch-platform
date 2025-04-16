import { DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false, // set true for dev only
  logging: false,
  entities: [__dirname + '/src/entities/*.{ts,js}'],
  migrations: [__dirname + '/src/migrations/*.{ts,js}'],
  ssl: {
    rejectUnauthorized: false, // Required for Neon Postgres
  },
};

export default config;
