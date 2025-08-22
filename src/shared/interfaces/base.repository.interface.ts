import { EntityManager, ObjectLiteral } from 'typeorm';
import { IBaseReadRepository } from './base.read-repository.interface';
import { IBaseWriteRepository } from './base.write-repository.interface';

export interface IBaseRepository<T extends ObjectLiteral, ID = string | number>
  extends IBaseReadRepository<T, ID>,
    IBaseWriteRepository<T, ID> {}
