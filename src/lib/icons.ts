import { CategoryIcon } from '@maps/types/index'

// Font Awesome v.5.15 icons
// Look for more here:
// https://fontawesome.com/v5.15/icons?d=gallery&p=2&s=regular&m=free
export const ICONS: Record<CategoryIcon, string> = {
  [CategoryIcon.car]: 'fa-car',
  [CategoryIcon.van]: 'fa-shuttle-van',
  [CategoryIcon.car_charger]: 'fa-bolt',
  [CategoryIcon.bike_charger]: 'fa-bicycle'
}
