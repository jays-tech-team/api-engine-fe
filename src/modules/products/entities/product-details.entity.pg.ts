import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'public_view_products_details_page' })
export class ProductDetailsView {
  @ViewColumn()
  ProductUuid!: string;

  @ViewColumn()
  ProductName!: string;

  @ViewColumn()
  ProductSlug!: string;

  @ViewColumn()
  Description!: string | null;

  @ViewColumn()
  Ingredients!: string | null;

  @ViewColumn()
  Allergens!: string | null;

  @ViewColumn()
  DeliveryInfo!: string | null;

  @ViewColumn()
  CareTips!: string | null;

  @ViewColumn()
  LongDescription!: string | null;

  @ViewColumn()
  MainCategory!: string | null;

  @ViewColumn()
  Categories!: any;

  @ViewColumn()
  Attributes!: any;

  @ViewColumn()
  Variations!: any;

  @ViewColumn()
  VariationAttributes!: any;

  @ViewColumn()
  Translations!: any;
}
