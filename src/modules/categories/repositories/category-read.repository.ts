import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryTreeView } from '../entities/category.entity.pg';
import { CategoryFilterDto } from '../dto/category-filter.dto';

@Injectable()
export class CategoryReadRepository {
  constructor(
    @InjectRepository(CategoryTreeView)
    private repo: Repository<CategoryTreeView>,
  ) {}

  async findAllVisible(): Promise<CategoryTreeView[]> {
    return this.repo.find({
      where: { IsHidden: false },
      order: { DisplayOrder: 'ASC' },
    });
  }

  async findVisibleFiltered(filter: CategoryFilterDto, page = 1, limit = 10) {
    const qb = this.repo.createQueryBuilder('c');

    qb.where('c."IsHidden" = :hidden', { hidden: false });

    if (typeof filter.slug === 'string') {
      qb.andWhere('c."CategorySlug" = :slug', {
        slug: String(filter.slug),
      });
    }
    // if (filter.q) {
    //   qb.andWhere('(c."CategoryName" ILIKE :q OR c."CategorySlug" ILIKE :q)', {
    //     q: `%${filter.q}%`,
    //   });
    // }

    qb.orderBy('c."DisplayOrder"', 'ASC');

    // total count before pagination
    const total: number = await qb.getCount();

    // pagination
    qb.skip((page - 1) * limit).take(limit);

    const data: CategoryTreeView[] = await qb.getMany();

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
