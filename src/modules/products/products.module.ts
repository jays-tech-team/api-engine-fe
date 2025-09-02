import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product.service';
import { ProductReadRepository } from './repositories/product-read.repository';
import { ProductListView } from './entities/product.entity.pg';

@Module({
  imports: [TypeOrmModule.forFeature([ProductListView])],
  controllers: [ProductController],
  providers: [ProductService, ProductReadRepository],
  exports: [ProductService],
})
export class ProductsModule {}
