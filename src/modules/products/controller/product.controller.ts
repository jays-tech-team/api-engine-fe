import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ProductFilterDto } from '../dto/product-filter.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async list(@Query() filter: ProductFilterDto) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    return this.productService.list(filter, page, limit);
  }
}
