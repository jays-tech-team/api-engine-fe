import { Controller, Get, Query } from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { ProductCategoryView } from '../entities/category.entity.pg';
import { CategoryFilterDto } from '../dto/category-filter.dto';
import type { PaginatedResult } from '../service/category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('visible')
  async getAllVisibleCategories(): Promise<ProductCategoryView[]> {
    return this.categoryService.getAllVisibleCategories();
  }

  @Get('visible/filtered')
  async getVisibleCategories(
    @Query() filter: CategoryFilterDto,
  ): Promise<PaginatedResult<ProductCategoryView>> {
    return this.categoryService.getVisibleCategories(filter);
  }
}
