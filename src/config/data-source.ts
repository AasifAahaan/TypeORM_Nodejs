import { DataSource } from 'typeorm';
import { User } from '../entity/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10), 
  username: process.env.DB_USER || 'postgres', 
  password: process.env.DB_PASSWORD || 'aasif@123', 
  database: process.env.DB_NAME || 'TypeORM', 
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});
