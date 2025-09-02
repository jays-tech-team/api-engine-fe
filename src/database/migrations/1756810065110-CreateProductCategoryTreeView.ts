import { MigrationInterface, QueryRunner } from 'typeorm';
import { DatabaseHelper } from '../../utils/helper/database.helper';

export class CreateProductCategoryTreeView1756810065110
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlFiles = ['views/2025-09-02-001-CreateProductCategoryTreeView.sql'];
    await DatabaseHelper.executeSqlFilesByNames(queryRunner, sqlFiles);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
