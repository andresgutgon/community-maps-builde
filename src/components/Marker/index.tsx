import cn from 'classnames'

import { useMapData } from '@maps/components/CommunityProvider'
import { CROWDFOUNDING_RANGES } from '@maps/components/FilterControl/useFilters'
import type { CategoryIcon } from '@maps/types/index'
import { ICONS } from '@maps/lib/icons'

export enum MarkerColor {
  brand = 'brand',
  black = 'black',
  pink = 'pink',
  green = 'green',
  lime = 'lime',
  blue = 'blue',
  yellow = 'yellow',
  violet = 'violet',
  red = 'red'
}

export enum Percentage {
  'thirty' = '30',
  'fifty' = '50',
  'seventy' = '70',
  'full' = '100'
}

export const useMarkerPercentage = (percentage: number): Percentage => {
  const {
    config: {
      crowdfunding: { showMarkerProgress }
    }
  } = useMapData()

  if (!showMarkerProgress) return Percentage.full

  if (percentage < CROWDFOUNDING_RANGES.starting.max) {
    return Percentage.thirty
  } else if (percentage < CROWDFOUNDING_RANGES.middle.max) {
    return Percentage.fifty
  } else if (percentage < CROWDFOUNDING_RANGES.finishing.max) {
    return Percentage.seventy
  }
  return Percentage.full
}

export type Color = { textColor: string; border: string; bg: string }
export const ICON_COLORS: Record<MarkerColor, Color> = {
  brand: {
    textColor: 'text-brand-button',
    border: 'border-brand-base',
    bg: 'bg-brand-button'
  },
  black: {
    textColor: 'text-gray-700',
    border: 'border-gray-800',
    bg: 'bg-gray-700/30'
  },
  pink: {
    textColor: 'text-pink-900',
    border: 'border-pink-800',
    bg: 'bg-pink-300'
  },
  lime: {
    textColor: 'text-lime-800',
    border: 'border-lime-800',
    bg: 'bg-lime-500'
  },
  green: {
    textColor: 'text-green-800',
    border: 'border-green-800',
    bg: 'bg-green-500'
  },
  blue: {
    textColor: 'text-blue-900',
    border: 'border-blue-900',
    bg: 'bg-blue-300'
  },
  violet: {
    textColor: 'text-violet-800',
    border: 'border-violet-800',
    bg: 'bg-violet-300'
  },
  yellow: {
    textColor: 'text-yellow-800',
    border: 'border-yellow-800',
    bg: 'bg-yellow-500'
  },
  red: { textColor: 'text-red-900', border: 'border-red-800', bg: 'bg-red-400' }
}

export const MARKER_BG_OPACITY = 'bg-opacity-30'
export enum MarkerSize {
  normal = 'normal',
  small = 'small'
}
export type Props = {
  color: MarkerColor
  size: MarkerSize
  percentage: Percentage
  iconKey: CategoryIcon
  isSelected: boolean
  active: boolean
  withArrow: boolean
}
const Marker = ({
  color,
  percentage = Percentage.full,
  iconKey,
  size,
  isSelected,
  isFilter,
  active,
  withArrow
}: Props) => {
  const { bg, textColor, border } = ICON_COLORS[color]
  return (
    <div
      className={cn({
        'overflow-hidden relative flex-none mt-1 sm:mt-0 rounded-full p-2 h-6 w-6 xs:h-8 xs:w-8':
          isFilter,
        'relative rounded-full shadow-sm': !isFilter,
        'h-10 w-10': size === 'normal',
        'h-6 w-6': size === 'small',
        [bg]: isSelected,
        [MARKER_BG_OPACITY]: !active,
        [border]: isSelected
      })}
    >
      <div
        className={cn(
          'bg-white overflow-hidden rounded-full absolute inset-0 z-10 flex items-center justify-center border',
          {
            [border]: isSelected,
            'bg-gray-100 border border-gray-500/30': !isSelected
          }
        )}
      >
        {isSelected ? (
          <>
            <div
              className={cn('z-0 rounded-full absolute inset-0 bg-opacity-10', {
                [bg]: isSelected
              })}
            />
            <div
              style={{ height: `${percentage}%` }}
              className={cn('z-10 absolute left-0 right-0 bottom-0', {
                [bg]: isSelected,
                [MARKER_BG_OPACITY]: !active
              })}
            />
          </>
        ) : null}
        <i
          className={cn('relative z-20 fas', ICONS[iconKey], {
            'text-base': size === 'normal',
            'text-xs p-2': size === 'small',
            [textColor]: isSelected,
            'text-gray-400': !isSelected
          })}
        />
      </div>
      {withArrow && size === 'normal' ? (
        <div className='z-0 pointer-events-none h-2 w-10 -bottom-2 absolute flex justify-center'>
          <div
            className={cn(
              '-mt-2 p-1 w-3 h-3 -ml-0.5 border rounded-sm rotate-45',
              {
                [bg]: isSelected,
                [MARKER_BG_OPACITY]: !active,
                [border]: isSelected,
                'bg-gray-300 border-gray-700/60': !isSelected
              }
            )}
          />
        </div>
      ) : null}
    </div>
  )
}

export default Marker
