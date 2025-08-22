import { ObjectLiteral, EntityManager } from 'typeorm';
import { RepositoryOptions } from '../types/repository.options';

export interface IBaseReadRepository<
  T extends ObjectLiteral,
  ID = string | number,
> {
  /**
   * Find entity by ID
   * @param id - The entity ID
   * @param idColumn - The ID column name
   * @param relations - The relations to include
   * @returns Promise with entity or null if not found
   */
  findById(
    id: ID,
    idColumn: string,
    relations?: string[],
    options?: RepositoryOptions,
  ): Promise<T | null>;

  /**
   * Find one entity by conditions
   * @param conditions - The conditions to find the entity
   * @param relations - The relations to include
   * @param options - The options to use
   * @returns Promise with entity or null if not found
   */
  findOne(
    conditions: Record<string, any>,
    relations?: string[],
    options?: RepositoryOptions,
  ): Promise<T | null>;

  /**
   * Find all entities by conditions
   * @param conditions - The conditions to find the entities
   * @param relations - The relations to include
   * @param options - The options to use
   * @returns Promise with entities
   */
  find(
    conditions?: Record<string, any>,
    relations?: string[],
    options?: RepositoryOptions,
  ): Promise<T[]>;

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
  getPaginatedList(
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc',
    params?: Record<string, any>,
    options?: RepositoryOptions,
  ): Promise<{
    items: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;
}
