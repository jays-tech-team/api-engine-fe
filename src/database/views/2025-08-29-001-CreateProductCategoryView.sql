DROP VIEW IF EXISTS public_view_product_categories;

CREATE VIEW public_view_product_categories AS
SELECT
    c.category_uuid      AS "CategoryUuid",
    c.category_name      AS "CategoryName",
    c.category_slug      AS "CategorySlug",
    c.image_url          AS "ImageUrl",
    c.parent_id          AS "ParentId",
    c.depth              AS "Depth",
    c.display_order      AS "DisplayOrder",
    c.is_hidden          AS "IsHidden",
    c.status             AS "Status",
    c.path_slugs         AS "PathSlugs",
    c.path_names         AS "PathNames",
    c.path_ids           AS "PathIds",
    c.count_products     AS "CountProducts",
    c.icon_url           AS "IconUrl",
    c.image_alt_text     AS "ImageAltText",
    c.icon_alt_text      AS "IconAltText",
    c.mobile_image_url   AS "MobileImageUrl",
    c.mobile_icon_url    AS "MobileIconUrl",
    c.description        AS "Description",
    p.category_uuid      AS "ParentUuid"

FROM product_categories c
LEFT JOIN LATERAL (
  SELECT
    pc.category_uuid
  FROM product_categories pc
  WHERE
    (pc.category_id IS NOT NULL AND pc.category_id = c.parent_id)
    OR (pc.category_uuid::text = c.parent_id::text)
  LIMIT 1
) p ON TRUE;
