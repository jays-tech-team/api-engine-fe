import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsUUID,
  IsIn,
  IsBoolean,
} from 'class-validator';

export class ProductFilterDto {
  @IsOptional()
  @IsString()
  category_slug?: string;

  @IsOptional()
  @IsUUID()
  category_uuid?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined ? value === 'true' || value === true : undefined,
  )
  @IsBoolean()
  is_featured?: boolean;

  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined ? value === 'true' || value === true : undefined,
  )
  @IsBoolean()
  has_inventory?: boolean;

  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined ? value === 'true' || value === true : undefined,
  )
  @IsBoolean()
  has_express_delivery?: boolean;

  @IsOptional()
  @IsIn(['ProductName', 'FinalPrice'])
  sort_by?: 'ProductName' | 'FinalPrice';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort_order?: 'ASC' | 'DESC';

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
