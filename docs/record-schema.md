#### API schema for Neatline records ####
The following fields must be supported by the back-end adapter for *record* objects. Fields that are new as of 3.0 are indicated in **bold**.

API property             | SQL column type
---                      | ---
o:id                     | INT(10) UNSIGNED NOT NULL AUTO_INCREMENT
o:owner_id               | INT(10) UNSIGNED NOT NULL
o:item_id                | INT(10) UNSIGNED NULL
o:exhibit_id             | INT(10) UNSIGNED NULL
o:added                  | TIMESTAMP DEFAULT CURRENT_TIMESTAMP
o:modified               | TIMESTAMP NULL
o:is_coverage            | TINYINT(1) NOT NULL
o:is_wms                 | TINYINT(1) NOT NULL
o:slug                   | VARCHAR(100) NULL
o:title                  | MEDIUMTEXT NULL
o:item_title             | MEDIUMTEXT NULL
o:body                   | MEDIUMTEXT NULL
o:coverage               | GEOMETRY NOT NULL
o:tags                   | TEXT NULL
o:widgets                | TEXT NULL
o:presenter              | VARCHAR(100) NULL
o:fill_color             | VARCHAR(100) NULL
o:fill_color_select      | VARCHAR(100) NULL
o:stroke_color           | VARCHAR(100) NULL
o:stroke_color_select    | VARCHAR(100) NULL
o:fill_opacity           | DECIMAL(3,2) NULL
o:fill_opacity_select    | DECIMAL(3,2) NULL
o:stroke_opacity         | DECIMAL(3,2) NULL
o:stroke_opacity_select  | DECIMAL(3,2) NULL
o:stroke_width           | INT(10) UNSIGNED NULL
o:point_radius           | INT(10) UNSIGNED NULL
o:zindex                 | INT(10) UNSIGNED NULL
o:weight                 | INT(10) UNSIGNED NULL
o:start_date             | VARCHAR(100) NULL
o:end_date               | VARCHAR(100) NULL
o:after_date             | VARCHAR(100) NULL
o:before_date            | VARCHAR(100) NULL
o:point_image            | VARCHAR(100) NULL
o:wms_address            | TEXT NULL
o:wms_layers             | TEXT NULL
o:min_zoom               | INT(10) UNSIGNED NULL
o:max_zoom               | INT(10) UNSIGNED NULL
o:map_zoom               | INT(10) UNSIGNED NULL
o:map_focus              | VARCHAR(100) NULL
