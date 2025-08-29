import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, IsUUID } from 'class-validator';

export class CategoryFilterDto {
  @IsOptional()
  @IsUUID()
  parent_uuid?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  @IsInt()
  @Min(1)
  limit?: number;
}
