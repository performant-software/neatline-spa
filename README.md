# Neatline 3
React app and API providing map and markup support, standalone but intended to be embedded in Omeka (or similar CMS), built around Leaflet.

NB: This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). If you want the guide for that it's [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## API Documentation
- [Most recent here](https://docs.google.com/document/d/1TkVSBa5-aycAiadtw3sQne5kVUuWfzMvKSxExxw-WsE/edit)

### Exhibits:
**GET {omeka-root}/api/neatline_exhibits**  
Returns an array of JSON representations for all exhibits where `o:public` equals true
Optional param `jwt`: authenticates a user, including all private exhibits they have permission to view in the returned array

**GET {omeka-root}/api/neatline_exhibits/{exhibit-id}**   
Returns the exhibit’s JSON representation
Required param `jwt`: authenticates a user, returning the exhibit if they have permission to view it

**POST {omeka-root}/api/neatline_exhibits**  
Creates an exhibit from a JSON payload in the request body
Required header `Content-Type`: `application/json`
Required param `jwt`: authenticates the user who will own the created exhibit

**PATCH {omeka-root}/api/neatline_exhibits/{exhibit-id}**  
Updates an existing exhibit with the JSON payload in the request body
Required header `Content-Type`: `application/json`
Required param `jwt`: authenticates a user with permission to edit the exhibit

**DELETE {omeka-root}/api/neatline_exhibits/{exhibit-id}**  
Destroys an existing exhibit
Required param `jwt`: authenticates a user with permission to destroy the exhibit

### Records:
**GET {omeka-root}/api/neatline_records**   
Returns an array of JSON representations for all records
Optional param `jwt`: authenticates a user, including records from private exhibits they have permission to view in the returned array
Optional param `exhibit_id`: filters the returned record representations to only include those that belong to the specified exhibit

**POST {omeka-root}/api/neatline_records**   
Creates an exhibit from a JSON payload in the request body
Required header `Content-Type`: `application/json`
Required param `jwt`: authenticates a user with permission to create a record

**PATCH {omeka-root}/api/neatline_records/{record-id}**  
Updates an existing record with the JSON payload in the request body
Required header `Content-Type`: `application/json`
Required param `jwt`: authenticates a user with permission to edit the record

**DELETE {omeka-root}/api/neatline_records/{record-id}**  
Destroys an existing record
Required param `jwt`: authenticates a user with permission to destroy the record


## Setup Dev Environment
This repository provides the core functionality - an API and an interface for editing exhibits and records. Additionally it can be used as extension to Omeka-S after it is wrapped in [this repository](https://github.com/performant-software/neatline-omeka-s).

This should be expanded with instructions, in the meantime here's a [diagram](https://drive.google.com/file/d/1tKu8S7ppeVvBOj55q3IfuHQpg7v-hE1T/view?usp=sharing) to get you started.
