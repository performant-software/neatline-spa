#### Notes on migrating exhibits from Neatline 2.6.1 instances ###

- The `exhibit_type` property has been added to exhibits in 3.0 and should be determined as follows:
    - If the exhibit's `spatial_layer` value is not null, `exhibit_type` should be set to 0 (the value corresponding to 'MAP')
    - If `spatial_layer` is null and `image_layer` has a value other than null or an empty string, `exhibit_type` should be set to 1 (the value corresponding to 'IMAGE')
    - If `spatial_layer` is null and `image_layer` is null or empty but `wms_address` and/or `spatial_layers` has a value other than null or an empty string, `exhibit_type` should be set to 0
    - If `spatial_layer`, `image_layer`, `wms_address`, and `spatial_layers` are all null or empty, `exhibit_type` should be set to -1 (the value corresponding to 'UNDEFINED')
- The `spatial_layer` exhibit property has been updated to use keys from an enumerated set of types, and certain layer types may be deprecated for general-purpose use due to changes in their APIs. As this implementation is still in progress, decisions about how specifically to process this property should be made later on.
