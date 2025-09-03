import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ExampleMongoEntity } from '../entities/example.mongo.entity';
import { IBaseReadRepository } from '../../../shared/interfaces';
import { RepositoryOptions } from '../../../shared/types/repository.options';

@Injectable()
export class ExampleReadRepository
  implements IBaseReadRepository<ExampleMongoEntity, string>
{
  constructor(
    @InjectRepository(ExampleMongoEntity, 'mongo')
    private readonly exampleRepository: Repository<ExampleMongoEntity>,
  ) {}

  /**
   * Find entity by ID
   * @param id - The entity ID
   * @param idColumn - The ID column name
   * @param relations - The relations to include
   * @returns Promise with entity or null if not found
   */
  async findById(
    id: string,
    idColumn: string,
    relations?: string[],
    options?: RepositoryOptions,
  ): Promise<ExampleMongoEntity | null> {
    const example = await this.exampleRepository.findOne({ where: { id } });
    return example;
  }

  /**
   * Find one entity by conditions
   * @param conditions - The conditions to find the entity
   * @param relations - The relations to include
   * @param options - The options to use
   * @returns Promise with entity or null if not found
   */
  async findOne(
    conditions: Record<string, any>,
    relations?: string[],
    options?: RepositoryOptions,
  ): Promise<ExampleMongoEntity | null> {
    const example = await this.exampleRepository.findOne({ where: conditions });
    return example;
  }

  /**
   * Find all entities by conditions
   * @param conditions - The conditions to find the entities
   * @param relations - The relations to include
   * @param options - The options to use
   * @returns Promise with entities
   */
  async find(
    conditions?: Record<string, any>,
    relations?: string[],
    options?: RepositoryOptions,
  ): Promise<ExampleMongoEntity[]> {
    const examples = await this.exampleRepository.find({
      where: conditions,
      relations,
    });
    return examples;
  }

  /**
   * Find entity by ID
   * @param page - The page number
   * @param limit - The number of entities per page
   * @param sortBy - The field to sort by
   * @param sortOrder - The order to sort by
   * @param search - The search query
   * @param criteria - The criteria to filter by
   * @returns Promise with entity or null if not found
   */
  async getPaginatedList(
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc',
    params?: Record<string, any>,
    options?: RepositoryOptions,
  ): Promise<{
    items: ExampleMongoEntity[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const [examples, total] = await this.exampleRepository.findAndCount({
      where: params,
      relations: options?.relations,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      items: examples,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
