import { CategoryIcon } from '@maps/types/index'

// Font Awesome v.5.15 icons
// Look for more here:
// https://fontawesome.com/v5.15/icons?d=gallery&p=2&s=regular&m=free
export const ICONS: Record<CategoryIcon, string> = {
  [CategoryIcon.car]: 'fa-car',
  [CategoryIcon.van]: 'fa-shuttle-van',
  [CategoryIcon.charger]: 'fa-bolt',
  [CategoryIcon.bike]: 'fa-bicycle',
  [CategoryIcon.solar_panel]: 'fa-solar-panel'
}
