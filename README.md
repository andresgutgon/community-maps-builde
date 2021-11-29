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
                                               |       forms(s)       |
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
- `/:community_id/:map_id/types` - As defined in the relations a map can have 1 or more types
- `/:community_id/:map_id/markers` - Grouped markers of all types in that map. Index of markers with basic info
    - filters:
      - progress_start: 0 // SQL markes.progress < start > end;
      - progress_end: 75
      - categerory
-  `/:community_id/:map_id/markers/:id` - Extended info of a marker

### COMMUNITY model
Is not really a model. We setup each community communication with this service with a secret token
With that we can start talking with an Odoo complient server to serve maps and markers.

### MAP model
- `name`
- `description`

### MAP_TYPE model
- `type` - `mobility`, `housing`, `energy`
- `form_schema` - look for a way to relate static form schema and show in this endpoint
  - NOTE: The shape of the form is related with the type of crowdfounding.
- `crowdfounding_types` - Is this a 1 -- n relation between `map_type` and `crowdfounding_type`?
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
- `active` - `boolean`
- `founding_progress` - A percentage of the crowfounding accomplished
  - 0% founded
  - <= 80%
  - > 80% funded (Hot marker)
  - 100% Funded

**TODO**: Better understand how the different crowfounding models works.

### Development
- You need to have installed in your machine [Node > 16.x.x](https://nodejs.org/en/)
- You need to have [Yarn](https://yarnpkg.com/)
- Clone this repo in your machine.
- Run `yarn install`
- Run `yarn dev` and go to `http://localhost:3000`

You should be able to see this project in your machine and make changes.

## Internationalization and translation
We use [react-intl](https://formatjs.io/docs/react-intl/) for making the maps multi language. Also we use the standard way in [NextJS of managing locales](https://nextjs.org/docs/advanced-features/i18n-routing)
To create a new translated string you can do in 2 ways in our react components:

### Maps in multiple languages
You can access the map in Spanish (our default language) like this:
`https://our-maps-server.org/:community_id/maps/:map_id`
and you can access in catalan like this:
`https://our-maps-server.org/ca/:community_id/maps/:map_id`

### With useIntl React hook
```
import { useIntl } from 'react-intl'
const HelloI18nComponent = () => {
  const intl = useIntl()
  return <span>{intl.formatMessage({ defaultMessage: '¿Hola qué tal?'})}</span>
}
```

### With <FormattedMessage /> component
```
import { FormattedMessage } from 'react-intl'
const HelloI18nComponent = () => {
  const intl = useIntl()
  return <span><FormatMessage defaultMessage='¿Hola qué tal?' /></span>
}
```

### Translation generation
By default you as developer use `useIntl` or `<FormattedMessage />` in your components and set the `defaultMessage` in
**Spanish** because that's our default message.
Then in our `package.json` we have 3 commands `extract:i18n`, `compile:i18n` and `i18n`
Let's explain what do each command:
`extract:i18n` it takes all strings in our components and add to `content/locales/es.json`
`compile:i18n` it takes all JSON files from `content/locales/*.json` in all locales and put on `content/compiled-locales/*.json`
`i18n` is the combination of `extract:i18n` and `compile:i18n`
The files in `content/compiled-locales/*.json` are the final result the user see in the browser. You can see how we load it on `src/pages/_app.tsx` file.

### How to translate from Spanish to other supported language
You can see the locales we support on `./next.config.js` in  `i18n.locales`. Also you can see there our `i18n.defaultLocale`

If a string is not translated in Catalan it will show in Spanish. This is nice because you can focus on developing your component and later translate it.
Now we don't use any external sass service for managing the translations.

The way we do is to take new added translations in `content/locales/es.json` after you run `yarn extract:i18n`. Put those keys in `content/locales/ca.json` and
translate it to catalan. **IMPORTANT** do NOT change autogenerated **IDs**
### Auto generated translation IDs
React Intl force all translation componenents to have an `id` attribute. So this is wrong
``` javascript
<FormattedMessage defaultMessage='¿Hola qué tal?` />
```
This will **FAIL** in our CI. to fix it you need to run `yarn lint`. This run `ESLint` with `--fix` flag which fix it for us.
Now if you see the componenent again in your editor you'll see ESLint add the `id` prop for us:
``` javascript
<FormattedMessage defaultMessage='¿Hola qué tal?' id="eOuNie" />
```
:warn: **NEVER CHANGE THE IDs MANUALLY**

## Testing
Take a look at the files ended in `*.test.ts` and get inspiration. When you are ready run
```
yarn test:watch
```

### Deployment
TO BE DEFINED

### RESOURCES
- [Leaflet tile providers](http://leaflet-extras.github.io/leaflet-providers/preview/index.html)


