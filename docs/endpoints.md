#### Exhibits: ####
- GET {omeka-root}/api/neatline_exhibits

  Returns an array of JSON representations for all exhibits where `o:public` equals true

  Optional param `jwt`: authenticates a user, including all private exhibits they have permission to view in the returned array

- GET {omeka-root}/api/neatline_exhibits/{exhibit-id}

  Returns the exhibit’s JSON representation

  Required param `jwt`: authenticates a user, returning the exhibit if they have permission to view it

- POST {omeka-root}/api/neatline_exhibits

  Creates an exhibit from a JSON payload in the request body

  Required header `Content-Type`: `application/json`

  Required param `jwt`: authenticates the user who will own the created exhibit

- PATCH {omeka-root}/api/neatline_exhibits/{exhibit-id}

  Updates an existing exhibit with the JSON payload in the request body

  Required header `Content-Type`: `application/json`

  Required param `jwt`: authenticates a user with permission to edit the exhibit

- DELETE {omeka-root}/api/neatline_exhibits/{exhibit-id}

  Destroys an existing exhibit

  Required param `jwt`: authenticates a user with permission to destroy the exhibit

#### Records: ####
- GET {omeka-root}/api/neatline_records

  Returns an array of JSON representations for all records

  Optional param `jwt`: authenticates a user, including records from private exhibits they have permission to view in the returned array

  Optional param `exhibit_id`: filters the returned record representations to only include those that belong to the specified exhibit

- POST {omeka-root}/api/neatline_records

  Creates an exhibit from a JSON payload in the request body

  Required header `Content-Type`: `application/json`

  Required param `jwt`: authenticates a user with permission to create a record

- PATCH {omeka-root}/api/neatline_records/{record-id}

  Updates an existing record with the JSON payload in the request body

  Required header `Content-Type`: `application/json`

  Required param `jwt`: authenticates a user with permission to edit the record

- DELETE {omeka-root}/api/neatline_records/{record-id}

  Destroys an existing record

  Required param `jwt`: authenticates a user with permission to destroy the record
