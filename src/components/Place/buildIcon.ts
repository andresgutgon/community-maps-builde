import { divIcon, DivIcon } from 'leaflet'
import cn from 'classnames'

import type { Category } from '@maps/types/index'
import { ICONS } from '@maps/lib/icons'

type BuildIconProps = { category: Category }
export default function buildIcon ({ category }: BuildIconProps): DivIcon {
  const icon = ICONS[category] || ICONS[ICONS.car]
  return divIcon({
    className: null,
    html: `
      <div class='h-10 w-10 relative rounded-full shadow-md border border-[#e9bd00] bg-[#facb00]'>
        <div
          class='rounded-full absolute inset-0 z-10 flex items-center justify-center bg-[#facb00] border border-white border-opacity-75'>
          <i class="${cn('fas text-base text-[#3f3e3e] text-opacity-90', icon)}"
          ></i>
        </div>
        <div class='pointer-events-none h-2 w-10 -bottom-2 absolute flex justify-center'>
          <div class='-mt-2 p-1 w-3 h-3 -ml-0.5 border bg-[#facb00] border-[#e9bd00] rounded-sm shadow-md transform rotate-45 '></div>
        </div>
      </div>
    `,
    iconSize:    [40, 40],
    iconAnchor:  [19, 46],
    popupAnchor: [2, -50],
    tooltipAnchor: [2, -40],
  })
}
