import { divIcon, DivIcon } from 'leaflet'
import cn from 'classnames'

import type { Category, IconColor } from '@maps/types/index'
import { ICONS } from '@maps/lib/icons'

type Color = { icon: string, border: string, bg: string }
const ICON_COLORS: Record<IconColor, Color> = {
  brand: { icon: 'text-[#3f3e3e]', border: 'border-[#e9bd00]', bg: 'bg-[#facb00]' },
  pink: { icon: 'text-white', border: 'border-pink-800', bg: 'bg-pink-600' },
  green: { icon: 'text-white', border: 'border-green-800', bg: 'bg-green-600' },
  blue: { icon: 'text-white', border: 'border-blue-800', bg: 'bg-blue-600' },
  yellow: { icon: 'text-white', border: 'border-yellow-800', bg: 'bg-yellow-600' },
  black: { icon: 'text-white', border: 'border-gray-800', bg: 'bg-gray-600' },
  purple: { icon: 'text-white', border: 'border-purple-800', bg: 'bg-purple-600' },
}
type BuildIconProps = { category: Category }
export default function buildIcon ({ category }: BuildIconProps): DivIcon {
  const icon = ICONS[category.iconKey] || ICONS[ICONS.car]
  const color = ICON_COLORS[category.iconColor]
  return divIcon({
    className: null,
    html: `
      <div class='h-10 w-10 relative rounded-full shadow-md border ${color.border} ${color.bg}'>
        <div
          class='rounded-full absolute inset-0 z-10 flex items-center justify-center ${color.bg} border border-white border-opacity-75'>
          <i class="${cn('fas text-base text-opacity-90', color.icon, icon)}"></i>
        </div>
        <div class='pointer-events-none h-2 w-10 -bottom-2 absolute flex justify-center'>
          <div class='-mt-2 p-1 w-3 h-3 -ml-0.5 border ${color.border} ${color.bg} rounded-sm shadow-md transform rotate-45'></div>
        </div>
      </div>
    `,
    iconSize:    [40, 40],
    iconAnchor:  [19, 46],
    popupAnchor: [2, -50],
    tooltipAnchor: [2, -40],
  })
}
