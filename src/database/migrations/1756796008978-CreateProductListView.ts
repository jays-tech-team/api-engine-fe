import { MigrationInterface, QueryRunner } from 'typeorm';
import { DatabaseHelper } from '../../utils/helper/database.helper';

export class CreateProductListView1756796008978 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlFiles = ['views/2025-09-01-001-CreateProductListView.sql'];
    await DatabaseHelper.executeSqlFilesByNames(queryRunner, sqlFiles);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
