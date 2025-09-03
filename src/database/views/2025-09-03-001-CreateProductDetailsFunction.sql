DROP FUNCTION IF EXISTS find_product_details_by_uuid(uuid, jsonb);
CREATE OR REPLACE FUNCTION find_product_details_by_uuid(
    p_product_uuid uuid,
    p_options jsonb DEFAULT '{}'
)
RETURNS TABLE(
    product_uuid uuid,
    product_name varchar,
    product_slug varchar,
    sku varchar,
    product_type_id int,
    category_id int,
    cost numeric,
    regular_price numeric,
    sale_price numeric,
    vat_class_id int,
    vat_percentage numeric,
    is_featured boolean,
    is_backorder boolean,
    has_inventory boolean,
    is_visible boolean,
    is_wrappable boolean,
    has_shipping_fee boolean,
    has_express_delivery boolean,
    has_variations boolean,
    preparation_time int,
    weight numeric,
    weight_unit weight_unit_enum,
    product_image_url varchar,
    status status_enum,
    read_id varchar,
    write_id varchar,
    product_details jsonb,
    seo_meta jsonb,
    category jsonb,
    attributes jsonb,
    variants jsonb,
    translations jsonb,
    collections jsonb,
    product_images jsonb
)
LANGUAGE plpgsql
AS $$
DECLARE
    includeProductDetails boolean := COALESCE(p_options->>'includeProductDetails', 'false')::boolean;
    includeMeta boolean := COALESCE(p_options->>'includeMeta', 'false')::boolean;
    includeCategory boolean := COALESCE(p_options->>'includeCategory', 'false')::boolean;
    includeAttributes boolean := COALESCE(p_options->>'includeAttributes', 'false')::boolean;
    includeVariants boolean := COALESCE(p_options->>'includeVariants', 'false')::boolean;
    includeTranslations boolean := COALESCE(p_options->>'includeTranslations', 'false')::boolean;
    includeDetailsTranslations boolean := COALESCE(p_options->>'includeDetailsTranslations', 'false')::boolean;
    includeCollections boolean := COALESCE(p_options->>'includeCollections', 'false')::boolean;
    includeProductImages boolean := COALESCE(p_options->>'includeProductImages', 'false')::boolean;
    includeProductImagesTranslations boolean := COALESCE(p_options->>'includeProductImagesTranslations', 'false')::boolean;
    productUuid uuid := COALESCE(NULLIF(p_product_uuid, '00000000-0000-0000-0000-000000000000'::uuid), NULL);
    
BEGIN
    IF productUuid IS NULL OR productUuid = '00000000-0000-0000-0000-000000000000'::uuid THEN
        RAISE EXCEPTION 'VALIDATION_ERROR:productUuid__PRODUCT_UUID_REQUIRED_%', productUuid;
    END IF;
    RETURN QUERY EXECUTE format(
        'SELECT
            p.product_uuid,
            p.product_name,
            p.product_slug,
            p.sku,
            p.product_type_id,
            p.category_id,
            p.cost,
            p.regular_price,
            p.sale_price,
            p.vat_class_id,
            p.vat_percentage,
            p.is_featured,
            p.is_backorder,
            p.has_inventory,
            p.is_visible,
            p.is_wrappable,
            p.has_shipping_fee,
            p.has_express_delivery,
            p.has_variations,
            p.preparation_time,
            p.weight,
            p.weight_unit,
            p.product_image_url,
            p.status,
            p.read_id,
            p.write_id,
            %s::jsonb AS product_details,
            %s::jsonb AS seo_meta,
            %s::jsonb AS category,
            %s::jsonb AS attributes,
            %s::jsonb AS variants,
            %s::jsonb AS translations,
            %s::jsonb AS collections,
            %s::jsonb AS product_images
         FROM products p
         WHERE p.product_uuid = %L',
         
         -- product_details JSON with conditional translations
        CASE WHEN includeProductDetails THEN
            '(SELECT json_build_object(
                ''barcode'', pd.barcode,
                ''ingredients'', pd.ingredients,
                ''allergens'', pd.allergens,
                ''delivery_info'', pd.delivery_info,
                ''care_tips'', pd.care_tips,
                ''long_description'', pd.long_description' ||
            CASE WHEN includeDetailsTranslations THEN
                ',
                ''translations'', (
                    SELECT json_agg(
                        json_build_object(
                            ''language_code'', pdt.language_code,
                            ''language_country'', pdt.language_country,
                            ''ingredients'', pdt.ingredients,
                            ''allergens'', pdt.allergens,
                            ''delivery_info'', pdt.delivery_info,
                            ''care_tips'', pdt.care_tips,
                            ''long_description'', pdt.long_description
                        )
                    )
                    FROM product_details_translations pdt
                    WHERE pdt.product_detail_id = pd.product_detail_id
                    AND pdt.deleted_at IS NULL
                )'
            ELSE '' END || '
            )
            FROM product_details pd
            WHERE pd.product_id = p.product_id
            AND pd.deleted_at IS NULL
            LIMIT 1)'
            ELSE 'NULL' END,
         
         -- seo_meta JSON
        CASE WHEN includeMeta THEN
            '(SELECT json_agg(
                json_build_object(
                    ''seo_page_meta_uuid'', seo.seo_page_meta_uuid,
                    ''language_code'', seo.language_code,
                    ''language_country'', seo.language_country,
                    ''meta_title'', seo.meta_title,
                    ''meta_description'', seo.meta_description,
                    ''meta_keywords'', seo.meta_keywords,
                    ''meta_image_url'', seo.meta_image_url,
                    ''reference_id'', seo.reference_id,
                    ''reference_type'', seo.reference_type,
                    ''reference_slug'', seo.reference_slug
                )
            )
            FROM seo_page_meta seo
            WHERE seo.reference_id = p.product_id
            AND seo.reference_type = ''products''
            AND seo.deleted_at IS NULL)'
        ELSE 'NULL' END,
         
         -- categories JSON
         CASE WHEN includeCategory THEN
            '(SELECT json_agg(
                json_build_object(
                    ''category_uuid'', cat.category_uuid,
                    ''category_name'', cat.category_name,
                    ''category_slug'', cat.category_slug
                )
              )
              FROM product_categories cat
              WHERE cat.category_id = p.category_id)'
         ELSE 'NULL' END,
         -- attributes JSON
         CASE WHEN includeAttributes THEN
            '(SELECT json_agg(
                    json_build_object(
                    ''attribute_uuid'', a.attribute_uuid,
                    ''attribute_name'', a.attribute_name,
                    ''attribute_label'', COALESCE(pa.custom_attribute_label, a.attribute_name),
                    ''attribute_slug'', a.attribute_slug,
                    ''input_type'', a.input_type,
                    ''is_required'', a.is_required,
                    ''is_swatchable'', a.is_swatchable,
                    ''options'', (
                        SELECT json_agg(
                        json_build_object(
                            ''option_uuid'', ao.option_uuid,
                            ''option_label'', COALESCE(pao.custom_attribute_option_label, ao.option_label),
                            ''option_value'', ao.option_value,
                            ''meta_data'', pao.meta_data
                        )
                        )
                        FROM product_attribute_options pao
                        JOIN attribute_options ao ON pao.option_id = ao.option_id
                        WHERE ao.attribute_id = a.attribute_id
                        AND pao.product_id = p.product_id
                        AND pao.deleted_at IS NULL
                    )
                    )
                )
                FROM product_attributes pa
                JOIN attributes a ON pa.attribute_id = a.attribute_id
                WHERE pa.product_id = p.product_id
                    AND a.deleted_at IS NULL
                    AND pa.deleted_at IS NULL)'
         ELSE 'NULL' END,
         
         -- variants JSON
        CASE WHEN includeVariants THEN
            '(SELECT json_agg(
                json_build_object(
                    ''product_variation_uuid'', pv.product_variation_uuid,
                    ''sku'', pv.sku,
                    ''regular_price'', pv.regular_price,
                    ''sale_price'', pv.sale_price,
                     ''cost_price'', pv.cost_price,
                    ''stock_quantity'', pv.stock_quantity,
                    ''is_default'', pv.is_default,
                    ''weight'', pv.weight,
                    ''weight_unit'', pv.weight_unit,
                    ''attributes'', (
                        SELECT json_agg(
                            json_build_object(
                                ''attribute_uuid'', a.attribute_uuid,
                                ''attribute_name'', a.attribute_name,
                                ''attribute_slug'', a.attribute_slug,
                                ''option_uuid'', ao.option_uuid,
                                ''option_value'', ao.option_value
                            )
                        )
                        FROM variation_attribute_values vav
                        JOIN attributes a ON vav.attribute_id = a.attribute_id
                        JOIN attribute_options ao ON vav.attribute_option_id = ao.option_id
                        WHERE vav.product_variation_id = pv.product_variation_id
                        AND a.deleted_at IS NULL
                        AND ao.deleted_at IS NULL
                    )
                )
            )
            FROM product_variations pv
            WHERE pv.product_id = p.product_id
            AND pv.deleted_at IS NULL)'
        ELSE 'NULL' END,
         -- translations JSON
         CASE WHEN includeTranslations THEN
            '(SELECT json_agg(
                json_build_object(
                    ''language_code'', pt.language_code,
                    ''language_country'', pt.language_country,
                    ''product_name'', pt.product_name,
                    ''description'', pt.description,
                    ''product_image_url'', pt.product_image_url
                )
              )
              FROM products_translations pt
              WHERE pt.product_id = p.product_id)'
         ELSE 'NULL' END,
         -- collections JSON
         CASE WHEN includeCollections THEN
            '(SELECT json_agg(
                json_build_object(
                    ''collection_uuid'', co.collection_uuid,
                    ''collection_name'', co.collection_name,
                    ''collection_slug'', co.collection_slug,
                    ''collection_type_slug'', ct.collection_type_slug
                )
              )
              FROM product_collections pcol
              JOIN collections co ON pcol.collection_id = co.collection_id
              JOIN collection_types ct ON co.collection_type_id = ct.collection_type_id
              WHERE pcol.product_id = p.product_id)'
         ELSE 'NULL' END,
        -- media JSON with conditional translations
CASE WHEN includeProductImages THEN
    '(SELECT json_agg(
        json_build_object(
            ''media_id'', pi.media_id,
            ''product_image_id'', pi.product_image_id,
            ''media_type'', pi.media_type,
            ''image_url'', pi.image_url,
            ''thumbnail_url'', pi.thumbnail_url,
            ''small_url'', pi.small_url,
            ''medium_url'', pi.medium_url,
            ''large_url'', pi.large_url,
            ''alt_text'', pi.alt_text,
            ''is_default'', pi.is_default' ||
    CASE WHEN includeProductImagesTranslations THEN
        ',
            ''translations'', (
                SELECT json_agg(
                    json_build_object(
                        ''language_code'', pimt.language_code,
                        ''language_country'', pimt.language_country,
                        ''alt_text'', pimt.alt_text,
                        ''image_url'', pimt.image_url,
                        ''thumbnail_url'', pimt.thumbnail_url
                    )
                )
                FROM product_images_translations pimt
                WHERE pimt.product_image_id = pi.product_image_id
                  AND pimt.deleted_at IS NULL
            )'
    ELSE '' END || '
        )
    )
    FROM product_images pi
    WHERE pi.product_id = p.product_id
      AND pi.deleted_at IS NULL)'
ELSE 'NULL' END,
         
         -- UUID parameter
         productUuid
    );
END;
$$;
