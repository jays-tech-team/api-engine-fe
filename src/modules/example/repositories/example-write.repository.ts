import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ExampleEntity } from '../entities/example.entity';
import { IBaseWriteRepository } from '../../../shared/interfaces';
import { RepositoryOptions } from 'src/shared/types/repository.options';

@Injectable()
export class ExampleWriteRepository
  implements IBaseWriteRepository<ExampleEntity, string>
{
  constructor(
    @InjectRepository(ExampleEntity)
    private readonly exampleRepository: Repository<ExampleEntity>,
  ) {}

  /**
   * Get the model for the admin notification
   * @param manager - The manager to use
   * @returns The model for the admin notification
   */
  getModel(manager?: EntityManager): Repository<ExampleEntity> {
    return manager?.getRepository(ExampleEntity) ?? this.exampleRepository;
  }

  /**
   * Create an example
   * @param data - The data to create the example with
   * @param options - The options for the repository
   * @returns The result of the create
   */
  async create(
    data: Partial<ExampleEntity>,
    options?: RepositoryOptions,
  ): Promise<ExampleEntity> {
    return this.getModel(options?.manager).save(data);
  }

  /**
   * Update an example
   * @param id - The id of the example to update
   * @param data - The data to update the example with
   * @param options - The options for the repository
   * @returns The result of the update
   */
  async update(
    id: string,
    data: Partial<ExampleEntity>,
    options?: RepositoryOptions,
  ): Promise<ExampleEntity> {
    return this.getModel(options?.manager).save(data);
  }

  /**
   * Soft delete an example
   * @param id - The id of the example to delete
   * @param options - The options for the repository
   * @returns The result of the soft delete
   */
  async softDelete(id: string, options?: RepositoryOptions): Promise<void> {
    await this.getModel(options?.manager).softDelete(id);
  }

  /**
   * Hard delete an example
   * @param id - The id of the example to delete
   * @param options - The options for the repository
   * @returns The result of the hard delete
   */
  async hardDelete(id: string, options?: RepositoryOptions): Promise<void> {
    await this.getModel(options?.manager).delete(id);
  }
}
