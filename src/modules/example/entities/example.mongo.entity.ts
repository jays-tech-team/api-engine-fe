import { Entity, Column, Index } from 'typeorm';
import { BaseMongoEntity } from '../../../shared/entities/base-mongo.entity';

@Entity('examples')
export class ExampleMongoEntity extends BaseMongoEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 'active' })
  status: 'active' | 'inactive';

  // Read-optimized fields
  @Column({ nullable: true })
  nameLower?: string; // For case-insensitive searches

  @Column({ nullable: true })
  nameLength?: number; // For analytics

  @Column({ nullable: true })
  searchTerms?: string[]; // Pre-computed search terms

  @Column({ nullable: true })
  statistics?: {
    viewCount?: number;
    lastViewed?: Date;
    popularity?: number;
  };

  // Denormalized data for faster reads
  @Column({ nullable: true })
  summary?: {
    totalViews?: number;
    averageRating?: number;
    lastActivity?: Date;
  };
}
