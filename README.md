# What is this?
This is a NextJS application running a Node server that is used to serve community maps to show ammount of contributions on the different places this community want to be.
It will show a map with al the places and the ammount of contributors and in some cases a percentage of the goal in money accomplished.

This application with communicate with our Odoo community servers to get the information about their places and also to request new users contributions

## Spec
This is WIP when finish we should have a `/doc` folder with these info
### Relations
This is the way we visualize the relations between maps and markers. A `map_type` is the join relation between both.
Within the type we define the type of crowdfounding if any.
 +----------------------------------+
 |                                  |       +---------------------------+
 |                                  |       |                           |
 |                                  |       |                           |
 |                                  |       |                           |
 |                                  |       |                           |
 |                                  |       |                           |
 |                                  |       |                           |
 |            Community           1 +-------+n          map(s)          |
 |                                  |       |                           |
 |                                  |       |                           |
 |                                  |       |                           |
 |                                  |       |                           |
 |                                  |       |                           |
 |                                  |       |              1            |
 |                                  |       +--------------+------------+
 |                                  |                      |
 +----------------------------------+                      |
                                               +-----------v----------+
                                               |           n          |
                                               |                      |
                                               |                      |
                                               |       map_type(s)    |
                                               |                      |
                                               |                      |
                                               |           1          |
                                               +-----------+----------+
                                                           |
                                               +-----------v----------+
                                               |           n          |
                                               |                      |
                                               |                      |
                                               |        marker(s)     |
                                               |                      |
                                               |                      |
                                               +----------------------+
### Endpoints
These are the endpoints an Odoo server has to have to use this builder
- `/:community_id/config` - Community config like `theme: { color: '#someColor' }`
- `/community_id/maps` - Helpful for displaying all maps of that Odoo instance in the Wordpress plugin
- `/:community_id/:map_id/types` - As defined in the relations a map can have 1 or more types
- `/:community_id/:map_id/markers` - Grouped markers of all types in that map. Index of markers with basic info
-  `/:community_id/:map_id/markers/:id` - Extended info of a marker

### COMMUNITY model
Is not really a model. We setup each community communication with this service with a secret token
With that we can start talking with an Odoo complient server to serve maps and markers.

### MAP model
- `name`
- `description`

### MAP_TYPE model
- `type` - `mobility`, `housing`, `energy`
- `form_schema` - (look for a way to relate static form schema and show in this endpoint
- `crowdfounding`
  - `none` - by default is interest in users
  - `ammount_of_money` - (ABSOLUTE) User compromise a fixed amount of money
  - `loan` - (ABSOLUTE) User compromises a contribution and he receives a yearly interest + some benefits on the service (optional) + return of the contribution after loan period is over.
  - `loan_on_credit` - (ABSOLUTE) User compromises a contribution and the yearly interest goes on usage credit + benefits on the service (optional) + return of the contribution after loan period is over.
  - `monthly_fee` - (MONTHLY) User compromise a monthly fee
    - `credit` - To be used on the service.
    - `fee` -  For being able to use the system with certain improved conditions.
    - `credit_and_fee` - Combination of both.
  - `mileage` - (KILOMETRAJE) User compromises a certain amount of mileage to be used on the vehicle.

** Not all of type of crowdfounding can be mixed.

### MARKER model
- `lat`
- `long`
- `name`
- `slug` - Useful when clicking in the marker.
- `map_type_id` - Relation with the map type it belongs. Ex.: `mobility`
- `category_type` - `mobility` => `car`, `van`, `cargo_bite`, `charger`
- `status` - `active` | `founding` (others?)
- `founding_progress` - A percentage of the crowfounding accomplished
- `end_founding_date_at` - Marker can have an end crowdfounding date(time)

**TODO**: Better understand how the different crowfounding models works.

### Development
- You need to have installed in your machine [Node > 16.x.x](https://nodejs.org/en/)
- You need to have [Yarn](https://yarnpkg.com/)
- Clone this repo in your machine.
- Run `yarn install`
- Run `yarn dev` and go to `http://localhost:3000`

You should be able to see this project in your machine and make changes.

### Testing
Take a look at the files ended in `*.test.ts` and get inspiration. When you are ready run
```
yarn test:watch
```

### Deployment
TO BE DEFINED


