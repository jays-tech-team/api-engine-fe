import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'public_view_products_listing_page' })
export class ProductListView {
  @ViewColumn()
  ProductUuid!: string;

  @ViewColumn()
  ProductName!: string;

  @ViewColumn()
  ProductSlug!: string;

  @ViewColumn()
  RegularPrice!: number | null;

  @ViewColumn()
  SalePrice!: number | null;

  @ViewColumn()
  FinalPrice!: number | null;

  @ViewColumn()
  IsFeatured!: boolean;

  @ViewColumn()
  HasInventory!: boolean;

  @ViewColumn()
  HasShippingFee!: boolean;

  @ViewColumn()
  HasExpressDelivery!: boolean;

  @ViewColumn()
  HasVariations!: boolean;

  @ViewColumn()
  ProductImageUrl!: string | null;

  @ViewColumn()
  CategoryName!: string;

  @ViewColumn()
  CategoryUuid!: string;

  @ViewColumn()
  CategorySlug!: string;

  @ViewColumn()
  CategoryImageUrl!: string | null;

  @ViewColumn()
  CategoryPathSlugs!: string | null;

  @ViewColumn()
  CategoryPathNames!: string | null;

  @ViewColumn()
  CategoryIconUrl!: string | null;

  @ViewColumn()
  CategoryImageAltText!: string | null;

  @ViewColumn()
  CategoryIconAltText!: string | null;

  @ViewColumn()
  CategoryMobileImageUrl!: string | null;

  @ViewColumn()
  CategoryMobileIconUrl!: string | null;

  @ViewColumn()
  CategoryDescription!: string | null;

  @ViewColumn()
  Translations!: any;
}
