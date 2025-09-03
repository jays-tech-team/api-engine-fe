import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleController } from './controller/example.controller';
import { ExampleService } from './service/example.service';
import { ExampleEntity } from './entities/example.entity';
import { ExampleMongoEntity } from './entities/example.mongo.entity';
import { ExampleReadRepository } from './repositories/example-read.repository';
import { ExampleWriteRepository } from './repositories/example-write.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExampleEntity]),
    TypeOrmModule.forFeature([ExampleMongoEntity], 'mongo'),
  ],
  controllers: [ExampleController],
  providers: [ExampleService, ExampleReadRepository, ExampleWriteRepository],
  exports: [ExampleService, ExampleReadRepository, ExampleWriteRepository],
})
export class ExampleModule {}
