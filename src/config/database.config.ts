import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm'; // For MongoDB for read and log

interface DatabaseConfig {
  write_postgres: TypeOrmModuleOptions;
  read_mongo: DataSourceOptions | null;
  redis: {
    host: string;
    port: number;
  } | null;
}

export const databaseConfig = (): DatabaseConfig => ({
  write_postgres: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'jays_core',
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    ssl:
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'staging'
        ? {
            rejectUnauthorized: false,
          }
        : false,
  },
  read_mongo: {
    name: 'mongo',
    type: 'mongodb',
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/jays_core',
    database: process.env.MONGO_DATABASE || 'jays_core',
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});
