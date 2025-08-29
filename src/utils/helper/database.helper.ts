import { dataSourceOptions } from '../../config/typeorm.config';
import { QueryRunner, DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

/**
 * Helper class for database operations
 */
export class DatabaseHelper {
  private static readonly logger = new Logger(DatabaseHelper.name);

  /**
   * Executes SQL statements from a file
   * @param queryRunner TypeORM query runner
   * @param filePath Path to the SQL file
   */
  static async executeSqlFile(
    queryRunner: QueryRunner,
    filePath: string,
  ): Promise<void> {
    const sql = fs.readFileSync(filePath, 'utf8');

    // Check if this is a stored procedure file (contains DELIMITER or $$)
    const isStoredProcedure = sql.includes('DELIMITER') || sql.includes('$$');

    if (isStoredProcedure) {
      // For stored procedures, execute the entire file as a single statement
      try {
        await queryRunner.query(sql);
        this.logger.log(
          `Successfully executed procedure file: ${path.basename(filePath)}`,
        );
      } catch (error) {
        this.logger.error(
          `Error executing stored procedure from ${path.basename(filePath)}:`,
          error,
        );
        throw error;
      }
    } else {
      // For regular SQL files, split and execute statements separately
      const statements = sql
        .split(';')
        .map((statement) => statement.trim())
        .filter((statement) => statement.length > 0);

      // Execute each statement separately
      for (const statement of statements) {
        try {
          await queryRunner.query(statement);
          this.logger.log(
            `Successfully executed statement from ${path.basename(filePath)}:`,
            statement,
          );
        } catch (error) {
          this.logger.error(
            `Error executing statement from ${path.basename(filePath)}:`,
            error,
          );
          throw error;
        }
      }
    }
  }

  /**
   * Gets all SQL files from the sql-dump directory matching the filter
   * @param filter Optional filter function to apply to filenames
   * @returns Array of SQL file paths
   */
  static getSqlFiles(filter?: (filename: string) => boolean): string[] {
    const sqlDumpDir = path.join(__dirname, '..', 'database', 'sql-dump');

    // Get all SQL files from the dump directory
    let files = fs
      .readdirSync(sqlDumpDir)
      .filter((file) => file.endsWith('.sql'))
      .sort(); // Sort by timestamp prefix

    // Apply additional filter if provided
    if (filter) {
      files = files.filter(filter);
    }

    return files.map((file) => path.join(sqlDumpDir, file));
  }

  /**
   * Executes all SQL files in the sql-dump directory matching the filter
   * @param queryRunner TypeORM query runner
   * @param filter Optional filter function to apply to filenames
   */
  static async executeSqlFiles(
    queryRunner: QueryRunner,
    filter?: (filename: string) => boolean,
  ): Promise<void> {
    const files = this.getSqlFiles(filter);

    // Execute each SQL file in order
    for (const filePath of files) {
      await this.executeSqlFile(queryRunner, filePath);
    }
  }

  /**
   * Finds and executes a specific SQL file by name pattern
   * @param queryRunner TypeORM query runner
   * @param namePattern Pattern to match in the filename
   * @throws Error if file not found
   */
  static async executeSqlFileByName(
    queryRunner: QueryRunner,
    namePattern: string,
  ): Promise<void> {
    const sqlDumpDir = path.join(__dirname, '..', 'database');

    // Find the file matching the pattern
    const file = fs
      .readdirSync(sqlDumpDir)
      .find((file) => file.includes(namePattern));

    if (!file) {
      throw new Error(
        `SQL file with pattern "${namePattern}" not found in sql-dump directory`,
      );
    }

    await this.executeSqlFile(queryRunner, path.join(sqlDumpDir, file));
  }

  /**
   * Executes specific SQL files by their filenames
   * @param queryRunner TypeORM query runner
   * @param filenames Array of filenames to execute
   */
  static async executeSqlFilesByNames(
    queryRunner: QueryRunner,
    filenames: string[],
  ): Promise<void> {
    const sqlDumpDir = path.join(__dirname, '../..', 'database');

    for (const filename of filenames) {
      const filePath = path.join(sqlDumpDir, filename);
      if (!fs.existsSync(filePath)) {
        throw new Error(
          `SQL file "${filename}" not found in sql-dump directory`,
        );
      }

      await this.executeSqlFile(queryRunner, filePath);
    }
  }

  /**
   * Executes SQL files from specific paths
   * @param queryRunner TypeORM query runner
   * @param filePaths Array of file paths to execute
   */
  static async executeSqlFilesFromPaths(
    queryRunner: QueryRunner,
    filePaths: string[],
  ): Promise<void> {
    for (const filePath of filePaths) {
      if (!fs.existsSync(filePath)) {
        throw new Error(`SQL file not found at path: ${filePath}`);
      }

      await this.executeSqlFile(queryRunner, filePath);
    }
  }

  /**
   * Truncates tables in the specified order to handle foreign key constraints
   * @param queryRunner TypeORM query runner
   * @param tables Array of table names to truncate
   */
  static async truncateTables(
    queryRunner: QueryRunner,
    tables: string[],
  ): Promise<void> {
    for (const table of tables) {
      await queryRunner.query(`TRUNCATE TABLE ${table} CASCADE;`);
    }
  }

  /**
   * Truncates all seeded tables in the correct order
   * @param queryRunner TypeORM query runner
   */
  static async truncateAllSeededTables(
    queryRunner: QueryRunner,
    tables: string[],
  ): Promise<void> {
    await this.truncateTables(queryRunner, tables);
  }
}

export const getDataSource = async (): Promise<DataSource> => {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();
  return dataSource;
};
