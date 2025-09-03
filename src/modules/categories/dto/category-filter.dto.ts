import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CategoryFilterDto {
  @IsOptional()
  @IsString()
  slug?: string;

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
