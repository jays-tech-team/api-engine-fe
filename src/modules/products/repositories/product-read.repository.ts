import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductListView } from '../entities/product.entity.pg';
import { ProductFilterDto } from '../dto/product-filter.dto';

@Injectable()
export class ProductReadRepository {
  constructor(
    @InjectRepository(ProductListView)
    private repo: Repository<ProductListView>,
  ) {}

  async findAllVisible(): Promise<ProductListView[]> {
    return this.repo.find({
      order: { ProductName: 'ASC' },
    });
  }

  async findVisibleFiltered(filter: ProductFilterDto, page = 1, limit = 10) {
    const qb = this.repo.createQueryBuilder('c');

    if (filter.category_slug) {
      qb.andWhere('c."CategorySlug" = :category_slug', {
        category_slug: filter.category_slug,
      });
    }

    if (filter.category_uuid) {
      qb.andWhere('c."CategoryUuid" = :category_uuid', {
        category_uuid: filter.category_uuid,
      });
    }

    if (filter.is_featured !== undefined) {
      qb.andWhere('c."IsFeatured" = :is_featured', {
        is_featured: filter.is_featured,
      });
    }

    if (filter.has_inventory !== undefined) {
      qb.andWhere('c."HasInventory" = :has_inventory', {
        has_inventory: filter.has_inventory,
      });
    }

    if (filter.has_express_delivery !== undefined) {
      qb.andWhere('c."HasExpressDelivery" = :has_express_delivery', {
        has_express_delivery: filter.has_express_delivery,
      });
    }

    const sortColumn =
      filter.sort_by === 'FinalPrice' ? 'c."FinalPrice"' : 'c."ProductName"';
    const sortOrder = filter.sort_order ?? 'ASC';
    qb.orderBy(sortColumn, sortOrder);

    // pagination
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
