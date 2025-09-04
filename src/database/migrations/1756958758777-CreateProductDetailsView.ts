import { MigrationInterface, QueryRunner } from 'typeorm';
import { DatabaseHelper } from '../../utils/helper/database.helper';

export class CreateProductDetailsView1756958758777
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlFiles = ['views/2025-09-03-001-CreateProductDetailsView.sql'];
    await DatabaseHelper.executeSqlFilesByNames(queryRunner, sqlFiles);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
