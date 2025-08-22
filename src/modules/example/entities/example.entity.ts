import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('examples')
export class ExampleEntity extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';
}
