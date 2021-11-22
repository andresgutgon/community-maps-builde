# What is this?
This is a NextJS application running a Node server that is used to serve community maps to show ammount of contributions on the different places this community want to be.
It will show a map with al the places and the ammount of contributors and in some cases a percentage of the goal in money accomplished.

This application with communicate with our Odoo community servers to get the information about their places and also to request new users contributions

## Spec
This is WIP when finish we should have a `/doc` folder with these info
### Relations
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

* markers index info:
- `lat`
- `long`
- `slug` - Useful when clicking in the marker.
- `map_type_id` - Relation with the map type it belongs
- `category_type` - This is defined in the frontend as explained

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


