import { JsonSchema, HorizontalLayout, VerticalLayout, GroupLayout } from '@jsonforms/core'
import type { IGeocoder } from '@maps/components/SearchControl/geocoders'
import { TILES } from '@maps/lib/tiles'

export type { JsonSchema, } from '@jsonforms/core'
export type UIJsonFormSchema = HorizontalLayout | VerticalLayout | GroupLayout
export enum GeocoderService {
  nominatim = 'nominatim',
  arcgis = 'arcgis'
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

export enum CategoryIcon {
  car = 'car',
  van = 'van',
  bike_charger = 'bike_charger',
  car_charger = 'car_charger'
}

export enum IconColor {
  brand = 'brand',
  pink = 'pink',
  blue = 'blue',
  green = 'green',
  yellow = 'yellow',
  black = 'black',
  purple = 'purple'
}

export type Map = {
  slug: string
  name: string
  description: string | null
  tyleStyle?: TileStyle
}

export type Category = {
  slug: string
  map_slug: string
  iconKey: CategoryIcon
  iconColor: IconColor
  name: string
  description: string | null
}

export type Form = {
  jsonSchema: JsonSchema,
  uiSchema: UIJsonFormSchema,
  initialData?: null | Record<string, any>
}

export type Place = {
  slug: string
  category_slug: string
  lat: string
  lng: string
  name: string
  address: string | null
  active: boolean
  goalProgress: number
}

type Theme = {
  color: string,
  tileStyle: TileStyle
}

export type Config = {
  theme: Theme
  maps: Record<string, Map>
  mapForms: Record<string, Form>
  categoryForms: Record<string, Form>
  categories: Record<string, Category>
}
