import { divIcon, DivIcon } from 'leaflet'
import cn from 'classnames'

import type { Category } from '@maps/types/index'
import { ICONS } from '@maps/lib/icons'

type BuildIconProps = { category: Category, dark: boolean }
export default function buildIcon ({ category, dark }: BuildIconProps): DivIcon {
  const icon = ICONS[category] || ICONS[ICONS.car]
  return divIcon({
    className: null,
    html: `
      <div class='h-10 w-10 relative rounded-full shadow-md border border-pink-800 bg-pink-600'>
        <div
          class='rounded-full absolute inset-0 z-10 flex items-center justify-center bg-pink-600 border border-white border-opacity-75'>
          <i class="${cn('fas text-base text-white text-opacity-90', icon)}"
          ></i>
        </div>
        <div class='pointer-events-none h-2 w-10 -bottom-2 absolute flex justify-center'>
          <div class='-mt-2 p-1 w-3 h-3 -ml-0.5 border border-pink-800 rounded-sm shadow-md transform rotate-45 bg-pink-600'></div>
        </div>
      </div>
    `,
    iconSize:    [40, 40],
    iconAnchor:  [19, 46],
    popupAnchor: [2, -50],
    tooltipAnchor: [2, -40],
  })
}
