import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { ProductService, PaginatedResult } from '../service/product.service';
import { ProductFilterDto } from '../dto/product-filter.dto';
import { ProductDetailsFilterDto } from '../dto/product-details-filter.dto';
import { ProductListView } from '../entities/product.entity.pg';
import { ProductDetailsView } from '../entities/product-details.entity.pg';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async list(
    @Query() filter: ProductFilterDto,
  ): Promise<PaginatedResult<ProductListView>> {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    return this.productService.list(filter, page, limit);
  }

  @Get('details')
  async getDetails(
    @Query() filter: ProductDetailsFilterDto,
  ): Promise<ProductDetailsView> {
    const product = await this.productService.getDetails(filter);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
