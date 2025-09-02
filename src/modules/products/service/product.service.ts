import { Injectable } from '@nestjs/common';
import { ProductReadRepository } from '../repositories/product-read.repository';
import { ProductListView } from '../entities/product.entity.pg';
import { ProductFilterDto } from '../dto/product-filter.dto';

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
export class ProductService {
  constructor(private readonly productReadRepository: ProductReadRepository) {}

  async list(filter: ProductFilterDto, page = 1, limit = 10) {
    return this.productReadRepository.findVisibleFiltered(filter, page, limit);
  }
}
