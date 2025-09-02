DROP VIEW IF EXISTS public_view_category_tree CASCADE;
DROP FUNCTION IF EXISTS category_children(integer);


CREATE OR REPLACE FUNCTION category_children(p_parent_id integer)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  res jsonb;
BEGIN
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'CategoryId', c.category_id,
        'CategoryUuid', c.category_uuid,
        'CategoryName', c.category_name,
        'CategorySlug', c.category_slug,
        'ImageUrl', c.image_url,
        'ParentId', c.parent_id,
        'Depth', c.depth,
        'DisplayOrder', c.display_order,
        'IsHidden', c.is_hidden,
        'Status', c.status,
        'PathSlugs', c.path_slugs,
        'PathNames', c.path_names,
        'PathIds', c.path_ids,
        'CountProducts', c.count_products,
        'IconUrl', c.icon_url,
        'ImageAltText', c.image_alt_text,
        'IconAltText', c.icon_alt_text,
        'MobileImageUrl', c.mobile_image_url,
        'MobileIconUrl', c.mobile_icon_url,
        'Description', c.description,
        'Child', category_children(c.category_id)   
      )
    ),
    '[]'::jsonb
  )
  INTO res
  FROM product_categories c
  WHERE c.parent_id = p_parent_id
    AND c.status = 'active'
    AND c.deleted_at IS NULL;

  RETURN res;
END;
$$;


CREATE OR REPLACE VIEW public_view_category_tree AS
WITH RECURSIVE category_hierarchy AS (

    SELECT 
        category_id,
        category_uuid,
        category_slug,
        category_name,
        image_url,
        parent_id,
        depth,
        display_order,
        is_hidden,
        status,
        path_slugs,
        path_names,
        path_ids,
        count_products,
        icon_url,
        image_alt_text,
        icon_alt_text,
        mobile_image_url,
        mobile_icon_url,
        description
    FROM product_categories
    WHERE parent_id IS NULL
      AND status = 'active'
      AND deleted_at IS NULL

    UNION ALL

    -- Recursive case: children
    SELECT 
        pc.category_id,
        pc.category_uuid,
        pc.category_slug,
        pc.category_name,
        pc.image_url,
        pc.parent_id,
        pc.depth,
        pc.display_order,
        pc.is_hidden,
        pc.status,
        pc.path_slugs,
        pc.path_names,
        pc.path_ids,
        pc.count_products,
        pc.icon_url,
        pc.image_alt_text,
        pc.icon_alt_text,
        pc.mobile_image_url,
        pc.mobile_icon_url,
        pc.description
    FROM product_categories pc
    INNER JOIN category_hierarchy ch 
        ON pc.parent_id = ch.category_id
    WHERE pc.status = 'active'
      AND pc.deleted_at IS NULL
)
SELECT 
    ch.category_id        AS "CategoryId",
    ch.category_uuid      AS "CategoryUuid",
    ch.category_slug      AS "CategorySlug",
    ch.category_name      AS "CategoryName",
    ch.image_url          AS "ImageUrl",
    ch.parent_id          AS "ParentId",
    ch.depth              AS "Depth",
    ch.display_order      AS "DisplayOrder",
    ch.is_hidden          AS "IsHidden",
    ch.status             AS "Status",
    ch.path_slugs         AS "PathSlugs",
    ch.path_names         AS "PathNames",
    ch.path_ids           AS "PathIds",
    ch.count_products     AS "CountProducts",
    ch.icon_url           AS "IconUrl",
    ch.image_alt_text     AS "ImageAltText",
    ch.icon_alt_text      AS "IconAltText",
    ch.mobile_image_url   AS "MobileImageUrl",
    ch.mobile_icon_url    AS "MobileIconUrl",
    ch.description        AS "Description",
    jsonb_build_object(
      'CategoryId', ch.category_id,
      'CategoryUuid', ch.category_uuid,
      'CategoryName', ch.category_name,
      'CategorySlug', ch.category_slug,
      'ImageUrl', ch.image_url,
      'ParentId', ch.parent_id,
      'Depth', ch.depth,
      'DisplayOrder', ch.display_order,
      'IsHidden', ch.is_hidden,
      'Status', ch.status,
      'PathSlugs', ch.path_slugs,
      'PathNames', ch.path_names,
      'PathIds', ch.path_ids,
      'CountProducts', ch.count_products,
      'IconUrl', ch.icon_url,
      'ImageAltText', ch.image_alt_text,
      'IconAltText', ch.icon_alt_text,
      'MobileImageUrl', ch.mobile_image_url,
      'MobileIconUrl', ch.mobile_icon_url,
      'Description', ch.description,
      'Child', category_children(ch.category_id)
    ) AS "TreeInfo"
FROM category_hierarchy ch
ORDER BY ch.category_id;
