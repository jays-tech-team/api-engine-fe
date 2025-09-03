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
    pc.description AS "CategoryDescription",
    -- ✅ Translations JSON with safe keys + fallback for ae-ar and ae-en
    (
        COALESCE(
            jsonb_object_agg(
                pt.language_country || '-' || pt.language_code,
                jsonb_build_object(
                    'product_name', pt.product_name,
                    'product_image_url', pt.product_image_url
                )
            ) FILTER (
                WHERE pt.deleted_at IS NULL
                  AND pt.language_country IS NOT NULL
                  AND pt.language_code IS NOT NULL
            ),
            '{}'::jsonb
        )
        -- ✅ Ensure ae-ar exists
        || jsonb_build_object(
            'ae-ar',
            jsonb_build_object(
                'product_name', COALESCE(
                    MAX(pt_ae_ar.product_name), p.product_name
                ),
                'product_image_url', COALESCE(
                    MAX(pt_ae_ar.product_image_url), p.product_image_url
                )
            )
        )
        -- ✅ Ensure ae-en exists
        || jsonb_build_object(
            'ae-en',
            jsonb_build_object(
                'product_name', COALESCE(
                    MAX(pt_ae_en.product_name), p.product_name
                ),
                'product_image_url', COALESCE(
                    MAX(pt_ae_en.product_image_url), p.product_image_url
                )
            )
        )
    ) AS "Translations"
FROM products p
JOIN product_categories pc_leaf 
    ON p.category_id = pc_leaf.category_id
JOIN LATERAL unnest(string_to_array(pc_leaf.path_ids, ',')) AS cat_id_str(cat_id_text)
    ON TRUE
JOIN product_categories pc
    ON pc.category_id = cat_id_str.cat_id_text::INT
LEFT JOIN products_translations pt
    ON pt.product_id = p.product_id
   AND pt.deleted_at IS NULL
-- ✅ Explicit join for fallback ae-ar
LEFT JOIN products_translations pt_ae_ar
    ON pt_ae_ar.product_id = p.product_id
   AND pt_ae_ar.language_country = 'ae'
   AND pt_ae_ar.language_code = 'ar'
   AND pt_ae_ar.deleted_at IS NULL
-- ✅ Explicit join for fallback ae-en
LEFT JOIN products_translations pt_ae_en
    ON pt_ae_en.product_id = p.product_id
   AND pt_ae_en.language_country = 'ae'
   AND pt_ae_en.language_code = 'en'
   AND pt_ae_en.deleted_at IS NULL
WHERE p.status = 'active' 
  AND p.is_visible = TRUE 
  AND p.is_backorder = FALSE 
  AND p.deleted_at IS NULL 
  AND pc.deleted_at IS NULL
GROUP BY 
    p.product_uuid, p.product_name, p.product_slug, 
    p.regular_price, p.sale_price, p.is_featured, p.has_inventory,
    p.has_shipping_fee, p.has_express_delivery, p.has_variations,
    p.product_image_url,
    pc.category_name, pc.category_uuid, pc.category_slug, 
    pc.image_url, pc.path_slugs, pc.path_names, 
    pc.icon_url, pc.image_alt_text, pc.icon_alt_text, 
    pc.mobile_image_url, pc.mobile_icon_url, pc.description;
