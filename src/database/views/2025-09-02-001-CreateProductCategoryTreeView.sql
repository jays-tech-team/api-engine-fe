-- Drop existing function and view if any
DROP FUNCTION IF EXISTS category_children_full(integer);
DROP VIEW IF EXISTS public_view_category_tree;

-- Recursive function using CTE to guarantee ordering
CREATE OR REPLACE FUNCTION category_children_full(p_parent_id integer)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
    res json;
BEGIN
    WITH RECURSIVE tree AS (
        SELECT
            c.category_id,
            c.category_uuid,
            c.category_name,
            c.category_slug,
            c.image_url,
            c.parent_id,
            c.depth,
            c.display_order,
            c.is_hidden,
            c.status,
            c.path_slugs,
            c.path_names,
            c.path_ids,
            c.count_products,
            c.icon_url,
            c.image_alt_text,
            c.icon_alt_text,
            c.mobile_image_url,
            c.mobile_icon_url,
            c.description
        FROM product_categories c
        WHERE c.parent_id = p_parent_id
          AND c.status = 'active'
          AND c.deleted_at IS NULL
        ORDER BY c.display_order, c.category_id
    )
    SELECT COALESCE(
        json_agg(
            json_build_object(
                'CategoryUuid', t.category_uuid,
                'CategoryName', t.category_name,
                'CategorySlug', t.category_slug,
                'ImageUrl', t.image_url,
                'Depth', t.depth,
                'DisplayOrder', t.display_order,
                'IsHidden', t.is_hidden,
                'Status', t.status,
                'PathSlugs', t.path_slugs,
                'PathNames', t.path_names,
                'CountProducts', t.count_products,
                'IconUrl', t.icon_url,
                'ImageAltText', t.image_alt_text,
                'IconAltText', t.icon_alt_text,
                'MobileImageUrl', t.mobile_image_url,
                'Child', category_children_full(t.category_id),
                'MobileIconUrl', t.mobile_icon_url,
                'Description', t.description
            )
        ORDER BY t.display_order, t.category_id), '[]'::json
    ) INTO res
    FROM tree t;

    RETURN res;
END;
$$;

-- View using the fixed function
CREATE OR REPLACE VIEW public_view_category_tree AS
SELECT
    pc.category_uuid    AS "CategoryUuid",
    pc.category_name    AS "CategoryName",
    pc.category_slug    AS "CategorySlug",
    pc.image_url        AS "ImageUrl",
    pc.parent_id        AS "ParentId",
    pc.depth            AS "Depth",
    pc.display_order    AS "DisplayOrder",
    pc.is_hidden        AS "IsHidden",
    pc.status           AS "Status",
    pc.path_slugs       AS "PathSlugs",
    pc.path_names       AS "PathNames",
    pc.count_products   AS "CountProducts",
    pc.icon_url         AS "IconUrl",
    pc.image_alt_text   AS "ImageAltText",
    pc.icon_alt_text    AS "IconAltText",
    pc.mobile_image_url AS "MobileImageUrl",
    pc.mobile_icon_url  AS "MobileIconUrl",
    pc.description      AS "Description",
    json_build_object(
        'CategoryUuid', pc.category_uuid,
        'CategoryName', pc.category_name,
        'CategorySlug', pc.category_slug,
        'ImageUrl', pc.image_url,
        'Depth', pc.depth,
        'DisplayOrder', pc.display_order,
        'IsHidden', pc.is_hidden,
        'Status', pc.status,
        'PathSlugs', pc.path_slugs,
        'PathNames', pc.path_names,
        'CountProducts', pc.count_products,
        'IconUrl', pc.icon_url,
        'ImageAltText', pc.image_alt_text,
        'IconAltText', pc.icon_alt_text,
        'MobileImageUrl', pc.mobile_image_url,
        'MobileIconUrl', pc.mobile_icon_url,
        'Description', pc.description,
        'Child', category_children_full(pc.category_id)
    ) AS "TreeInfo"
FROM product_categories pc
WHERE pc.status = 'active'
  AND pc.deleted_at IS NULL
ORDER BY pc.display_order, pc.category_id;
