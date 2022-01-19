# What is this?
This is a NextJS application running a Node server that is used to serve community maps to show ammount of contributions.
It communicates with our Odoo community servers to get the information about their places and also to request new users contributions
![Map Image](/public/map.png)

## DOCUMENTATION
- [Data model](/doc/data-model.md)
- [Security](/doc/security.md)
- [Translations (i18n)](/doc/i18n.md)
- [Icons for places](/doc/icons.md)
- [JSON Schema Forms](/doc/json-schema-forms.md)

### Development
- You need to have installed in your machine [Node > 16.x.x](https://nodejs.org/en/)
- You need to have [Yarn](https://yarnpkg.com/)
- Clone this repo in your machine.
- Run `yarn install`
- Run `yarn dev` and go to `http://localhost:3000`

You should be able to see this project in your machine and make changes. We maintain a fake Odoo server as part of
the integration under `src/pages/mockServer`. If you have to develop new features do it with this APIs and then translate into Odoo.
This way both project can be develop independently.

## Testing
Take a look at the files ended in `*.test.ts` and get inspiration. When you are ready run
```
yarn test:watch
```

### Recreate demo data
We have a demo map based on places found in [sommobilitat](https://www.sommobilitat.coop/crowdfunding)
What we do is first fetch from their Wordpress API the places. You don't need to do this in general. This is already done.
```
node scripts/fetchSommobilitatRawPlaces.mjs
```

With the file fetched from sommobilitat we should see a JSON file in:
`./scripts/sommobilitat.json`

Now we generate demo map with:
```
node --experimental-json-modules ./scripts/generatePlaces.mjs
```
The flag `--experimental-json-modules` is important. Allow us to import JSON files in Node. Is experimental so maybe broke in the future.
With these 2 scripts you should be able to have two demo maps in this project:
1. One category. A map with only one category. Most common use case I guess.
2. Multiple categories. Just in case a community needs to show different kind of places.

### RESOURCES
- [Leaflet tile providers](http://leaflet-extras.github.io/leaflet-providers/preview/index.html)

