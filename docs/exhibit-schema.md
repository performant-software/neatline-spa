#### API schema for Neatline exhibits ####
The following fields must be supported by the back-end adapter for *exhibit* objects. Fields that are new as of 3.0 are indicated in **bold**.

API property             | SQL column type
---                      | ---
o:id                     | INT(10) UNSIGNED NOT NULL AUTO_INCREMENT
o:owner_id               | INT(10) UNSIGNED NOT NULL
o:added                  | TIMESTAMP DEFAULT CURRENT_TIMESTAMP
o:modified               | TIMESTAMP NULL
o:published              | TIMESTAMP NULL
o:item_query             | TEXT NULL
o:spatial_layers         | TEXT NULL
o:spatial_layer          | TEXT NULL
o:image_layer            | TEXT NULL
o:image_height           | SMALLINT UNSIGNED NULL
o:image_width            | SMALLINT UNSIGNED NULL
o:zoom_levels            | SMALLINT UNSIGNED NULL
o:wms_address            | TEXT NULL
o:wms_layers             | TEXT NULL
o:widgets                | TEXT NULL
o:title                  | TEXT NULL
o:slug                   | VARCHAR(100) NOT NULL
o:narrative              | LONGTEXT NULL
o:spatial_querying       | TINYINT(1) NOT NULL
o:public                 | TINYINT(1) NOT NULL
o:styles                 | TEXT NULL
o:map_focus              | VARCHAR(100) NULL
o:map_zoom               | INT(10) UNSIGNED NULL
o:accessible_url         | TEXT NULL
o:map_restricted_extent  | TEXT NULL
o:map_min_zoom           | SMALLINT UNSIGNED NULL
o:map_max_zoom           | SMALLINT UNSIGNED NULL
**o:tile_address**       | TEXT NULL
**o:image_attribution**  | TEXT NULL
**o:wms_attribution**    | TEXT NULL
**o:tile_attribution**   | TEXT NULL
**o:exhibit_type**       | INT(10) UNSIGNED NOT NULL DEFAULT 0
