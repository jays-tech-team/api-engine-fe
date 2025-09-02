import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { CategoryReadRepository } from './repositories/category-read.repository';
import { CategoryTreeView } from './entities/category.entity.pg';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryTreeView])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryReadRepository],
  exports: [CategoryService],
})
export class CategoriesModule {}
