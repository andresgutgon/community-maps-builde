import { TILES } from '@maps/lib/tiles'

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
