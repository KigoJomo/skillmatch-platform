import { DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false, // set true for dev only
  logging: false,
  entities: [__dirname + '/src/entities/*.{ts,js}'],
  migrations: [__dirname + '/src/migrations/*.{ts,js}'],
};

export default config;
