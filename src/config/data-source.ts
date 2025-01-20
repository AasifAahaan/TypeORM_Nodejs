import { DataSource } from 'typeorm';
import { User } from '../entity/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  // host: process.env.DB_HOST || 'host.docker.internal',  // Use 'host.docker.internal' for Docker
  host: process.env.DB_HOST || 'localhost',  // Use 'host.docker.internal' for Docker
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'aasif@123',
  database: process.env.DB_NAME || 'TypeORM',
  synchronize: true,  // Make sure you are okay with auto-syncing the schema (in production, this may be false)
  logging: true,      // Set logging to false for production if needed
  entities: [User],
  migrations: [],
  subscribers: [],
});
