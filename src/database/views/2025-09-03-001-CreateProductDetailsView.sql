DROP VIEW IF EXISTS public_view_products_details_page;

CREATE OR REPLACE VIEW public_view_products_details_page AS
WITH 
-- Pre-aggregate product translations for ae-ar and ae-en
product_trans AS (
    SELECT 
        p.product_id,
        jsonb_build_object(
            'ae-ar', jsonb_build_object(
                'ProductName', COALESCE(pt_ar.product_name, p.product_name),
                'Description', COALESCE(pt_ar.description, p.description),
                'Ingredients', COALESCE(pdt_ar.ingredients, pd.ingredients),
                'Allergens', COALESCE(pdt_ar.allergens, pd.allergens),
                'DeliveryInfo', COALESCE(pdt_ar.delivery_info, pd.delivery_info),
                'CareTips', COALESCE(pdt_ar.care_tips, pd.care_tips),
                'LongDescription', COALESCE(pdt_ar.long_description, pd.long_description)
            ),
            'ae-en', jsonb_build_object(
                'ProductName', COALESCE(pt_en.product_name, p.product_name),
                'Description', COALESCE(pt_en.description, p.description),
                'Ingredients', COALESCE(pdt_en.ingredients, pd.ingredients),
                'Allergens', COALESCE(pdt_en.allergens, pd.allergens),
                'DeliveryInfo', COALESCE(pdt_en.delivery_info, pd.delivery_info),
                'CareTips', COALESCE(pdt_en.care_tips, pd.care_tips),
                'LongDescription', COALESCE(pdt_en.long_description, pd.long_description)
            )
        ) AS translations
    FROM products p
    LEFT JOIN product_details pd ON pd.product_id = p.product_id AND pd.deleted_at IS NULL
    LEFT JOIN products_translations pt_ar
           ON pt_ar.product_id = p.product_id AND pt_ar.language_country = 'ae' AND pt_ar.language_code = 'ar' AND pt_ar.deleted_at IS NULL
    LEFT JOIN products_translations pt_en
           ON pt_en.product_id = p.product_id AND pt_en.language_country = 'ae' AND pt_en.language_code = 'en' AND pt_en.deleted_at IS NULL
    LEFT JOIN product_details_translations pdt_ar
           ON pdt_ar.product_detail_id = pd.product_detail_id AND pdt_ar.language_country = 'ae' AND pdt_ar.language_code = 'ar' AND pdt_ar.deleted_at IS NULL
    LEFT JOIN product_details_translations pdt_en
           ON pdt_en.product_detail_id = pd.product_detail_id AND pdt_en.language_country = 'ae' AND pdt_en.language_code = 'en' AND pdt_en.deleted_at IS NULL
),
-- Pre-aggregate categories with translations
category_agg AS (
    SELECT 
        pcp.product_id,
        json_agg(
            jsonb_build_object(
                'CategoryUuid', pc.category_uuid,
                'CategoryName', COALESCE(pct.category_name, pc.category_name),
                'CategorySlug', pc.category_slug,
                'CategoryPath', pc.path_names,
                'CategoryPathSlugs', pc.path_slugs,
                'IsPrimary', pc.parent_id IS NULL,
                'Depth', pc.depth
            )
        ) AS categories,
        MAX(pc.category_slug) FILTER (WHERE pc.parent_id IS NULL) AS main_category,
        jsonb_agg(
            jsonb_build_object(
                'CategoryUuid', pc.category_uuid,
                'CategoryName', COALESCE(pct.category_name, pc.category_name),
                'CategorySlug', pc.category_slug
            )
        ) AS categories_translated
    FROM product_categories_products pcp
    JOIN product_categories pc ON pcp.category_id = pc.category_id
    LEFT JOIN product_categories_translations pct
           ON pct.category_id = pc.category_id AND pct.deleted_at IS NULL
    GROUP BY pcp.product_id
),
-- Pre-aggregate attributes + options with translations
attribute_agg AS (
    SELECT 
        pa.product_id,
        json_agg(
            DISTINCT jsonb_build_object(
                'AttributeUuid', a.attribute_uuid,
                'AttributeName', COALESCE(at.attribute_name, a.attribute_name),
                'AttributeLabel', COALESCE(pa.custom_attribute_label, at.attribute_name, a.attribute_name),
                'AttributeSlug', a.attribute_slug,
                'InputType', a.input_type,
                'IsRequired', a.is_required,
                'IsSwatchable', a.is_swatchable,
                'Options', (
                    SELECT json_agg(
                        DISTINCT jsonb_build_object(
                            'OptionUuid', ao.option_uuid,
                            'OptionLabel', COALESCE(aot.option_label, pao.custom_attribute_option_label, ao.option_label::text),
                            'OptionValue', ao.option_value,
                            'MetaData', pao.meta_data
                        )
                    )
                    FROM product_attribute_options pao
                    JOIN attribute_options ao ON pao.option_id = ao.option_id AND ao.deleted_at IS NULL
                    LEFT JOIN attribute_options_translations aot ON aot.attribute_option_id = ao.option_id AND aot.deleted_at IS NULL
                    WHERE ao.attribute_id = a.attribute_id AND pao.product_id = pa.product_id AND pao.deleted_at IS NULL
                )
            )
        ) AS attributes
    FROM product_attributes pa
    JOIN attributes a ON pa.attribute_id = a.attribute_id AND a.deleted_at IS NULL
    LEFT JOIN attributes_translations at ON at.attribute_id = a.attribute_id AND at.deleted_at IS NULL
    WHERE pa.deleted_at IS NULL
    GROUP BY pa.product_id
),
-- Pre-aggregate variations
variation_agg AS (
    SELECT 
        pv.product_id,
        json_agg(
            DISTINCT jsonb_build_object(
                'ProductVariationUuid', pv.product_variation_uuid,
                'RegularPrice', pv.regular_price,
                'SalePrice', pv.sale_price,
                'StockQuantity', pv.stock_quantity,
                'IsDefault', pv.is_default,
                'Weight', pv.weight,
                'Attributes', (
                    SELECT json_agg(
                        DISTINCT jsonb_build_object(
                            'AttributeUuid', a.attribute_uuid,
                            'AttributeName', COALESCE(at.attribute_name, a.attribute_name),
                            'AttributeSlug', a.attribute_slug,
                            'OptionUuid', ao.option_uuid,
                            'OptionValue', ao.option_value
                        )
                    )
                    FROM variation_attribute_values vav
                    JOIN attributes a ON a.attribute_id = vav.attribute_id AND a.deleted_at IS NULL
                    LEFT JOIN attributes_translations at ON at.attribute_id = a.attribute_id AND at.deleted_at IS NULL
                    JOIN attribute_options ao ON ao.option_id = vav.attribute_option_id AND ao.deleted_at IS NULL
                    WHERE vav.product_variation_id = pv.product_variation_id
                )
            )
        ) AS variations
    FROM product_variations pv
    WHERE pv.deleted_at IS NULL
    GROUP BY pv.product_id
),
-- Pre-aggregate variation attributes
variation_attrs_agg AS (
    SELECT pva.product_id,
           json_agg(DISTINCT a.attribute_uuid) AS variation_attributes
    FROM product_variation_attributes pva
    JOIN attributes a ON a.attribute_id = pva.attribute_id AND a.deleted_at IS NULL
    WHERE pva.deleted_at IS NULL
    GROUP BY pva.product_id
)
SELECT 
    p.product_uuid AS "ProductUuid",
    p.product_name AS "ProductName",
    p.product_slug AS "ProductSlug",
    p.description AS "Description",
    pd.ingredients AS "Ingredients",
    pd.allergens AS "Allergens",
    pd.delivery_info AS "DeliveryInfo",
    pd.care_tips AS "CareTips",
    pd.long_description AS "LongDescription",
    cat.main_category AS "MainCategory",
    cat.categories AS "Categories",
    attr.attributes AS "Attributes",
    var.variations AS "Variations",
    vattrs.variation_attributes AS "VariationAttributes",
    -- Translations including product fields + categories + attributes
    jsonb_build_object(
        'ae-ar', jsonb_build_object(
            'ProductName', COALESCE(pt.translations->'ae-ar'->>'ProductName', p.product_name),
            'Description', COALESCE(pt.translations->'ae-ar'->>'Description', p.description),
            'Ingredients', COALESCE(pt.translations->'ae-ar'->>'Ingredients', pd.ingredients),
            'Allergens', COALESCE(pt.translations->'ae-ar'->>'Allergens', pd.allergens),
            'DeliveryInfo', COALESCE(pt.translations->'ae-ar'->>'DeliveryInfo', pd.delivery_info),
            'CareTips', COALESCE(pt.translations->'ae-ar'->>'CareTips', pd.care_tips),
            'LongDescription', COALESCE(pt.translations->'ae-ar'->>'LongDescription', pd.long_description),
            'Categories', cat.categories_translated,
            'Attributes', attr.attributes,
            'Variations', var.variations,
            'VariationAttributes', vattrs.variation_attributes
        ),
        'ae-en', jsonb_build_object(
            'ProductName', COALESCE(pt.translations->'ae-en'->>'ProductName', p.product_name),
            'Description', COALESCE(pt.translations->'ae-en'->>'Description', p.description),
            'Ingredients', COALESCE(pt.translations->'ae-en'->>'Ingredients', pd.ingredients),
            'Allergens', COALESCE(pt.translations->'ae-en'->>'Allergens', pd.allergens),
            'DeliveryInfo', COALESCE(pt.translations->'ae-en'->>'DeliveryInfo', pd.delivery_info),
            'CareTips', COALESCE(pt.translations->'ae-en'->>'CareTips', pd.care_tips),
            'LongDescription', COALESCE(pt.translations->'ae-en'->>'LongDescription', pd.long_description),
            'Categories', cat.categories_translated,
            'Attributes', attr.attributes,
            'Variations', var.variations,
            'VariationAttributes', vattrs.variation_attributes
        )
    ) AS "Translations"
FROM products p
LEFT JOIN product_details pd ON pd.product_id = p.product_id AND pd.deleted_at IS NULL
LEFT JOIN product_trans pt ON pt.product_id = p.product_id
LEFT JOIN category_agg cat ON cat.product_id = p.product_id
LEFT JOIN attribute_agg attr ON attr.product_id = p.product_id
LEFT JOIN variation_agg var ON var.product_id = p.product_id
LEFT JOIN variation_attrs_agg vattrs ON vattrs.product_id = p.product_id
WHERE p.deleted_at IS NULL
  AND p.status = 'active'::status_enum;
