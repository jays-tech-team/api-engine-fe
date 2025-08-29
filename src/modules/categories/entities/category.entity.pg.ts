import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'public_view_product_categories' })
export class ProductCategoryView {
  @ViewColumn()
  CategoryUuid!: string;

  @ViewColumn()
  CategoryName!: string;

  @ViewColumn()
  CategorySlug!: string;

  @ViewColumn()
  ImageUrl!: string | null;

  @ViewColumn()
  DisplayOrder!: number;

  @ViewColumn()
  CountProducts!: number;

  @ViewColumn()
  IsHidden!: boolean;

  @ViewColumn({ name: 'ParentId' })
  ParentId!: string | null;

  @ViewColumn({ name: 'Depth' })
  Depth!: number;

  @ViewColumn()
  Status!: string;

  @ViewColumn()
  PathSlugs!: string | null;

  @ViewColumn()
  PathNames!: string | null;

  @ViewColumn()
  PathIds!: string | null;

  @ViewColumn()
  IconUrl!: string | null;

  @ViewColumn()
  ImageAltText!: string | null;

  @ViewColumn()
  IconAltText!: string | null;

  @ViewColumn()
  MobileImageUrl!: string | null;

  @ViewColumn()
  MobileIconUrl!: string | null;

  @ViewColumn()
  Description!: string | null;

  @ViewColumn()
  ParentUuid!: string | null;
}
