import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { databaseConfig } from './database.config';

// Load environment variables
config();

// Default migrations directory
export const MIGRATIONS_DIR = join(__dirname, '..', 'database', 'migrations');

export const postgresConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbConfig = databaseConfig();
  if (!dbConfig || !dbConfig.write_postgres) {
    throw new Error('Postgres configuration is missing in databaseConfig');
  }
  return {
    ...(dbConfig.write_postgres as object),
    entities: ['src/core/entities/**/*.entity{.ts,.js}'],
    synchronize: false, // Disable automatic schema synchronization
  } as TypeOrmModuleOptions;
};
/**
 * Main TypeORM configuration that uses PostgreSQL configuration
 * @param configService - NestJS ConfigService instance
 * @returns TypeOrmModuleOptions
 */
export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return postgresConfig(configService);
};

/**
 * DataSource configuration for TypeORM migrations
 */
const configService = new ConfigService();
export const dataSourceOptions: DataSourceOptions = {
  ...postgresConfig(configService),
  migrations: [join(MIGRATIONS_DIR, '*.ts')],
  migrationsTableName: 'migrations',
  synchronize: false, // Disable automatic schema synchronization
  ssl:
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
      ? {
          rejectUnauthorized: false, // Allow self-signed or RDS certs which is needed for lightsail connections
        }
      : false,
} as DataSourceOptions;

export default new DataSource(dataSourceOptions);
