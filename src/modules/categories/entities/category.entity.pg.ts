import { ViewEntity, ViewColumn } from 'typeorm';
@ViewEntity({ name: 'public_view_category_tree' })
export class CategoryTreeView {
  @ViewColumn()
  CategoryUuid!: string;

  @ViewColumn()
  CategoryName!: string;

  @ViewColumn()
  CategorySlug!: string;

  @ViewColumn()
  ImageUrl!: string | null;

  @ViewColumn()
  Depth!: number;

  @ViewColumn()
  DisplayOrder!: number;

  @ViewColumn()
  IsHidden!: boolean;

  @ViewColumn()
  Status!: string;

  @ViewColumn()
  PathSlugs!: string | null;

  @ViewColumn()
  PathNames!: string | null;

  @ViewColumn()
  CountProducts!: number;

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
  TreeInfo!: any;
}
