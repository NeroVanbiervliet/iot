## Frontend

`npm install`
`npm run build`
`sudo python -m SimpleHTTPServer 90`

## Proto

met protobuf compiler:`protoc --python_out=. batch.proto`

## Tp (Transaction processor)

dependencies

* google.protobuf NEED testen



handler functions

* `_create_agent` maakt nieuwe agent
* `_create_record` maakt nieuwe record (en record container indien nodig)
* `_finalize_record` maakt record final (immutable)
* `_create_record_type` = *USELESS*, removed
* `_update_properties` 
* `_create_proposal` *= USELESS*, removed
* `_answer_proposal` *= USELESS*, removed
* `_accept_proposal` *= USELESS*, removed
* `_revoke_reporter` *= USELESS*, removed
* various helper functions