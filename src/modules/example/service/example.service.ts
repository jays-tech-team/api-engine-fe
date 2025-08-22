import { ExampleEntity } from '../entities/example.entity';
import { CreateExampleDto } from '../dto/create-example.dto';
import { UpdateExampleDto } from '../dto/update-example.dto';
import { PaginationDto } from '../../../shared/dto/base.dto';
import { ExampleReadRepository } from '../repositories/example-read.repository';
import { ExampleWriteRepository } from '../repositories/example-write.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ExampleService {
  constructor(
    private readonly exampleReadRepository: ExampleReadRepository,
    private readonly exampleWriteRepository: ExampleWriteRepository,
  ) {}

  /**
   * Create an example
   * @param createExampleDto - The create example dto
   * @returns The created example
   */
  async createExample(
    createExampleDto: CreateExampleDto,
  ): Promise<ExampleEntity> {
    // Check if example with same name already exists
    try {
      const existingExample = await this.exampleReadRepository.findOne({
        name: createExampleDto.name,
      });
      if (existingExample) {
        throw new Error('Example with this name already exists');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Example not found, which is what we want for creation
        // Continue with creation
      } else {
        throw error;
      }
    }

    return await this.exampleWriteRepository.create(createExampleDto);
  }

  /**
   * Update an example
   * @param id - The id of the example to update
   * @param updateExampleDto - The update example dto
   * @returns The updated example
   */
  async updateExample(
    id: string,
    updateExampleDto: UpdateExampleDto,
  ): Promise<ExampleEntity> {
    // Check if example exists
    const example = await this.exampleReadRepository.findById(id, 'id');

    if (!example) {
      throw new NotFoundException('Example not found');
    }

    return await this.exampleWriteRepository.update(id, updateExampleDto);
  }

  /**
   * Soft delete an example
   * @param id - The id of the example to soft delete
   * @returns The result of the soft delete
   */
  async softDeleteExample(id: string): Promise<void> {
    const example = await this.exampleReadRepository.findById(id, 'id'); // Check if exists
    if (!example) {
      throw new NotFoundException('Example not found');
    }

    await this.exampleWriteRepository.softDelete(id);
  }
}
