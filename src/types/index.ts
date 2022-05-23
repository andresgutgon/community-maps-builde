import {
  JsonSchema,
  HorizontalLayout,
  VerticalLayout,
  GroupLayout
} from '@jsonforms/core'
import { TILES } from '@maps/lib/tiles'
import { MarkerColor } from '@maps/components/Marker'

export type { JsonSchema } from '@jsonforms/core'
export type UIJsonFormSchema = HorizontalLayout | VerticalLayout | GroupLayout
export enum GeocoderService {
  nominatim = 'nominatim',
  arcgis = 'arcgis'
}

export type MapAttribution = {
  linkText: string
  link?: string
}

export type Tile = {
  url: string
  free: boolean
  minZoom: number
  maxZoom: number
  attributions: Array<MapAttribution>
}
export type TileStyle = keyof typeof TILES

export enum CategoryIcon {
  car = 'car',
  van = 'van',
  bike = 'bike',
  charger = 'charger',
  solar_panel = 'solar_panel'
}

export type Map = {
  slug: string
  name: string
  description: string | null
  tyleStyle?: TileStyle
}

export type Category = {
  slug: string
  iconKey: CategoryIcon
  iconColor: MarkerColor
  name: string
  description: string | null
  shareInTwitterText?: string
}
export type FilterGroup = {
  slug: string
  name: string
  filters: []
}

export type Filter = {
  slug: string
  name: string
  iconKey: CategoryIcon | null
  iconColor: MarkerColor | null
  description: string | null
}

export type Form = {
  slug: string
  ctaLabel?: string
  formButtonLabel?: string
  description?: string
  initialData?: null | Record<string, any>
  jsonSchema: JsonSchema
  uiSchema: UIJsonFormSchema
}

export type Place = {
  slug: string
  category_slug: string
  custom_filter_slugs: [] | null
  map_slug: string
  form_slug: string | null
  lat: string
  lng: string
  name: string
  address: string | null
  active: boolean
  goalProgress: number
}

export type PlaceDetail = Place & {
  schemaData?: any
  jsonSchema?: JsonSchema
  uiSchema?: UIJsonFormSchema
}

export type ThemeColor = {
  textColorBase: string
  fillColor: string
  borderColor: string
  buttonColor: string
  buttonColorHover: string
  buttonTextColor: string
  buttonTextColorHover: string
  buttonTextInvertedColor: string
  buttonTextInvertedColorHover: string
}
export type Theme = {
  color?: ThemeColor
  tileStyle: TileStyle
}

type Legal = {
  privacyLink?: string
  cookiesLink?: string
}
type Crowdfunding = {
  showMarkerProgress: boolean
}
export type ShowFilters = {
  status: boolean
  crowdfunding: boolean
  categories: boolean
}
export type Config = {
  theme: Theme
  crowdfunding: Crowdfunding
  showFilters: null | undefined | ShowFilters
  legal?: Legal
  forms?: Record<string, Form>
  suggestPlaceForms?: Record<string, Form>
  categories: Record<string, Category>
  categoriesInProposal: Record<string, Category>
}
