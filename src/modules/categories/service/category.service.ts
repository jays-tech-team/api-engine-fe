import { Injectable } from '@nestjs/common';
import { CategoryReadRepository } from '../repositories/category-read.repository';
import { CategoryTreeView } from '../entities/category.entity.pg';
import { CategoryFilterDto } from '../dto/category-filter.dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryReadRepository: CategoryReadRepository,
  ) {}

  async getAllVisibleCategories(): Promise<CategoryTreeView[]> {
    return this.categoryReadRepository.findAllVisible();
  }

  async getVisibleCategories(
    filter: CategoryFilterDto,
  ): Promise<PaginatedResult<CategoryTreeView>> {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    return this.categoryReadRepository.findVisibleFiltered(filter, page, limit);
  }
}
