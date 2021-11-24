export enum CommunityType {
  mobility = 'mobility',
  housing = 'housing',
  energy = 'energy'
}

export enum Category {
  car = 'car',
  van = 'van',
  bike_charger = 'bike_charger',
  car_charger = 'car_charger'
}

export type MapAttribution = {
  linkText: string,
  link?: string
}

export type Tile = {
  url: string,
  free: boolean,
  minZoom: number,
  maxZoom: number,
  attributions: Array<MapAttribution>
}
const SHARED_ATTRIBUTIONS = [
  {
    link: 'https://www.openstreetmap.org/copyright',
    linkText: 'OpenStreetMap'
  }
]
/**
 * You can see a list of providers here:
 * http://leaflet-extras.github.io/leaflet-providers/preview/index.html
 *
 * NOTE: Some providers might require API key and be a paid service.
 */
const DEFAULT_MIN_ZOOM = 7
export const TILES = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    free: true,
    minZoom: DEFAULT_MIN_ZOOM,
    maxZoom: 19,
    attributions: SHARED_ATTRIBUTIONS
  },
  arcgisonlineLightGray: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    free: false, // 2.000.000 tiles / month
    minZoom: DEFAULT_MIN_ZOOM,
    maxZoom: 14,
    attributions: [
      ...SHARED_ATTRIBUTIONS,
      { linkText: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ' }
    ]
  },
  stadiaOutdoors: {
    url: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
    free: false,
    minZoom: DEFAULT_MIN_ZOOM,
    maxZoom: 20,
    attributions: [
      ...SHARED_ATTRIBUTIONS,
      {
        linkText: '&copy; Stadia Maps',
        link: 'https://stadiamaps.com'
      },
      {
        linkText: 'OpenMapTiles',
        link: 'https://openmaptiles.org/'
      }
    ]

  }
}
export type TileStyle = keyof typeof TILES

export type Marker = {
  slug: string
  mapTypeId: number
  lat: string
  long: string
  name: string
  address: string | null
  active: boolean
  goalProgress: number,
  categoryType: Category
}

export type MapType = {
  id: number,
  type: CommunityType
}
export type Map = {
  slug: string
  name: string
  description: string | null
  map_types: Array<MapType>
  tyleStyle?: TileStyle
}

type Theme = {
  color: string,
  tileStyle: TileStyle
}

export type Config = {
  theme: Theme,
  maps: Array<Map>
}
