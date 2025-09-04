import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product.service';
import { ProductReadRepository } from './repositories/product-read.repository';
import { ProductDetailsReadRepository } from './repositories/product-details-read.repository';
import { ProductListView } from './entities/product.entity.pg';
import { ProductDetailsView } from './entities/product-details.entity.pg';

@Module({
  imports: [TypeOrmModule.forFeature([ProductListView, ProductDetailsView])],
  controllers: [ProductController],
  providers: [ProductService, ProductReadRepository, ProductDetailsReadRepository],
  exports: [ProductService],
})
export class ProductsModule {}
