import { ObjectLiteral } from 'typeorm';
import { RepositoryOptions } from '../types/repository.options';

export interface IBaseWriteRepository<
  T extends ObjectLiteral,
  ID = string | number,
> {
  create(data: T, options?: RepositoryOptions): Promise<T>;
  update(id: ID, data: T, options?: RepositoryOptions): Promise<T>;
  softDelete(id: ID, options?: RepositoryOptions): Promise<void>;
  hardDelete(id: ID, options?: RepositoryOptions): Promise<void>;
}
