# Security
This explains secure communication between maps server and Odoo servers.

Users can request maps for their community in this server like this:
```
https://maps-server.org/:community_id/maps/:map_id
```

When a request arrives the first thing we do is to check if we have a community with that `community_id`. To be able to serve this community
We have to have provisioned an `.env` variable in maps server with that community id like this:

```
// Imaging :community_id is sommconexio
// The ENV variable must be
SOMMCONEXIO_HOST=https://somconnexion-odoo.org/api/maps
```
If we find this ENV variavle we then can make requests to this server with a `SECRET_TOKEN` env varible that
this server has to have provisioned. This way only maps server can make requests to their API for creating
place submissions.

We'll make this request to get the config for a map with `:map_id` (A number or a slug).
```
curl https://somconnexion-odoo.org/api/maps/:map_id/config
   -H "Accept: application/json"
   -H "API-KEY: SECRET_TOKEN"
```
