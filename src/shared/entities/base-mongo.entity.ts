import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  ObjectIdColumn,
} from 'typeorm';

export abstract class BaseMongoEntity {
  @ObjectIdColumn()
  _id: string;

  @Column({ unique: true })
  id: string; // This will be the same as PostgreSQL UUID

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // Additional fields for read optimization
  @Column({ nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  tags?: string[];

  @Column({ default: 1 })
  version?: number;
}
