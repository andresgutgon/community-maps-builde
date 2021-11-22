export enum CommunityType {
  mobility = 'mobility',
  housing = 'housing',
  energy = 'energy'
}

enum Category {
  car = 'car',
  van = 'van',
  bike_charger = 'bike_charger',
  car_charger = 'car_charger'
}

type MapAttribution = {
  link: string,
  linkText: string
}

type Tile = {
  url: string,
  maxZoom: number,
  attributions: Array<MapAttribution>
}
const TILES = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    attributions: [
      {
        link: 'https://www.openstreetmap.org/copyright',
        linkText: 'OpenStreetMap'
      }
    ]
  }
}
export type TitleStyle = keyof typeof TILES

export type Marker = {
  slug: string
  mapTypeId: number
  lat: string
  long: string
  name: string
  address: string | null
  active: boolean
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
  tyleStyle?: TitleStyle
}

type Theme = {
  color: string,
  titleStyle: TitleStyle
}

export type Config = {
  theme: Theme,
  maps: Array<Map>
}
