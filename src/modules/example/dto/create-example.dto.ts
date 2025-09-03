import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateExampleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive' = 'active';
}
