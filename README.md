# What is this?
This is a NextJS application running a Node server that is used to serve community maps to show ammount of contributions.
It communicates with our Odoo community servers to get the information about their places and also to request new users contributions

## DOCUMENTATION
- [Data model](/doc/data-model.md)
- [Security](/doc/security.md)
- [Translations (i18n)](/doc/i18n.md)

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

### Deployment
TO BE DEFINED

### RESOURCES
- [Leaflet tile providers](http://leaflet-extras.github.io/leaflet-providers/preview/index.html)

