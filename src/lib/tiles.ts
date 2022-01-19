/**
 * You can see a list of providers here:
 * http://leaflet-extras.github.io/leaflet-providers/preview/index.html
 *
 * NOTE: Some providers might require API key and be a paid service.
 */
const TILE_DEFAULTS = {
  dark: false,
  minZoom: 3
}

const SHARED_ATTRIBUTIONS = [
  { link: 'https://www.openstreetmap.org/copyright', linkText: 'OpenStreetMap' }
]
const STADIA_ATTRIBUTIONS = [
  { linkText: '&copy; Stadia Maps', link: 'https://stadiamaps.com' },
  { linkText: 'OpenMapTiles', link: 'https://openmaptiles.org/' }
]

export const TILES = {
  osm: {
    ...TILE_DEFAULTS,
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    free: true,
    maxZoom: 19,
    attributions: SHARED_ATTRIBUTIONS
  },
  arcgisonlineLightGray: {
    ...TILE_DEFAULTS,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    free: false, // 2.000.000 tiles / month
    maxZoom: 14,
    attributions: [
      ...SHARED_ATTRIBUTIONS,
      { linkText: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ' }
    ]
  },
  stadiaOutdoors: {
    ...TILE_DEFAULTS,
    url: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
    free: false,
    maxZoom: 20,
    attributions: [...SHARED_ATTRIBUTIONS, ...STADIA_ATTRIBUTIONS]
  },
  stadiaSmoothDark: {
    ...TILE_DEFAULTS,
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    dark: true,
    maxZoom: 20,
    attributions: [...SHARED_ATTRIBUTIONS, ...STADIA_ATTRIBUTIONS]
  }
}
