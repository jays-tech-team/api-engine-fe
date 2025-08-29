import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategoryView } from '../entities/category.entity.pg';
import { CategoryFilterDto } from '../dto/category-filter.dto';

@Injectable()
export class CategoryReadRepository {
  constructor(
    @InjectRepository(ProductCategoryView)
    private repo: Repository<ProductCategoryView>,
  ) {}

  async findAllVisible(): Promise<ProductCategoryView[]> {
    return this.repo.find({
      where: { IsHidden: false },
      order: { DisplayOrder: 'ASC' },
    });
  }

  async findVisibleFiltered(filter: CategoryFilterDto, page = 1, limit = 10) {
    const qb = this.repo.createQueryBuilder('c');

    qb.where('c."IsHidden" = :hidden', { hidden: false });

    if (filter.parent_uuid) {
      qb.andWhere('c."ParentUuid" = :parent_uuid', {
        parent_uuid: filter.parent_uuid,
      });
    }

    if (filter.q) {
      qb.andWhere('(c."CategoryName" ILIKE :q OR c."CategorySlug" ILIKE :q)', {
        q: `%${filter.q}%`,
      });
    }

    qb.orderBy('c."DisplayOrder"', 'ASC');

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
