import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ProductDetailsFilterDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsUUID()
  uuid?: string;
}
