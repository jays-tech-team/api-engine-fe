import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDetailsView } from '../entities/product-details.entity.pg';
import { ProductDetailsFilterDto } from '../dto/product-details-filter.dto';

@Injectable()
export class ProductDetailsReadRepository {
  constructor(
    @InjectRepository(ProductDetailsView)
    private repo: Repository<ProductDetailsView>,
  ) {}

  async findBySlugOrUuid(
    filter: ProductDetailsFilterDto,
  ): Promise<ProductDetailsView | null> {
    const qb = this.repo.createQueryBuilder('p');

    if (filter.slug) {
      qb.andWhere('p."ProductSlug" = :slug', {
        slug: filter.slug,
      });
    }

    if (filter.uuid) {
      qb.andWhere('p."ProductUuid" = :uuid', {
        uuid: filter.uuid,
      });
    }

    return qb.getOne();
  }
}
