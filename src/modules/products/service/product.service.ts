import { Injectable } from '@nestjs/common';
import { ProductReadRepository } from '../repositories/product-read.repository';
import { ProductDetailsReadRepository } from '../repositories/product-details-read.repository';
import { ProductListView } from '../entities/product.entity.pg';
import { ProductDetailsView } from '../entities/product-details.entity.pg';
import { ProductFilterDto } from '../dto/product-filter.dto';
import { ProductDetailsFilterDto } from '../dto/product-details-filter.dto';

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
  constructor(
    private readonly productReadRepository: ProductReadRepository,
    private readonly productDetailsReadRepository: ProductDetailsReadRepository,
  ) {}

  async list(
    filter: ProductFilterDto,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<ProductListView>> {
    return this.productReadRepository.findVisibleFiltered(filter, page, limit);
  }

  async getDetails(
    filter: ProductDetailsFilterDto,
  ): Promise<ProductDetailsView | null> {
    return this.productDetailsReadRepository.findBySlugOrUuid(filter);
  }
}
