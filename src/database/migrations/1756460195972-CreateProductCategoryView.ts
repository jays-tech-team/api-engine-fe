import { DatabaseHelper } from '../../utils/helper/database.helper';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductCategoryView1756460195972
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlFiles = ['views/2025-08-29-001-CreateProductCategoryView.sql'];
    await DatabaseHelper.executeSqlFilesByNames(queryRunner, sqlFiles);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
