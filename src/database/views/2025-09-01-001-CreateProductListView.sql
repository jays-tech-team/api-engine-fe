DROP VIEW IF EXISTS public_view_products_listing_page;
CREATE OR REPLACE VIEW public_view_products_listing_page AS
SELECT 
	  p.product_uuid AS "ProductUuid",
    p.product_name AS "ProductName",
    p.product_slug AS "ProductSlug",
    p.regular_price AS "RegularPrice",
    p.sale_price AS "SalePrice",
    COALESCE(p.sale_price, p.regular_price) AS "FinalPrice",
    p.is_featured AS "IsFeatured",
    p.has_inventory AS "HasInventory",
    p.has_shipping_fee AS "HasShippingFee",
    p.has_express_delivery AS "HasExpressDelivery",
    p.has_variations AS "HasVariations",
    p.product_image_url AS "ProductImageUrl",
    pc.category_name AS "CategoryName",
    pc.category_uuid AS "CategoryUuid",
    pc.category_slug AS "CategorySlug",
    pc.image_url AS "CategoryImageUrl",
    pc.path_slugs AS "CategoryPathSlugs",
    pc.path_names AS "CategoryPathNames",
    pc.icon_url AS "CategoryIconUrl",
    pc.image_alt_text AS "CategoryImageAltText",
    pc.icon_alt_text AS "CategoryIconAltText",
    pc.mobile_image_url AS "CategoryMobileImageUrl",
    pc.mobile_icon_url AS "CategoryMobileIconUrl",
    pc.description AS "CategoryDescription"
FROM products p
INNER JOIN product_categories pc ON p.category_id = pc.category_id
WHERE p.status = 'active' AND p.is_visible = TRUE AND p.is_backorder = FALSE AND p.deleted_at IS NULL AND pc.deleted_at IS NULL;