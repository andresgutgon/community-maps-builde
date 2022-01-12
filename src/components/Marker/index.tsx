import cn from 'classnames'

import { CROWDFOUNDING_RANGES } from '@maps/components/FilterControl/useFilters'
import type { CategoryIcon } from '@maps/types/index'
import { ICONS } from '@maps/lib/icons'

export enum MarkerColor {
  brand = 'brand',
  black = 'black',
  pink = 'pink',
  green = 'green',
  blue = 'blue',
  yellow = 'yellow',
  red = 'red'
}

export enum Percentage {
  'thirty'= '30',
  'fifty' = '50',
  'seventy' = '70',
  'full' = '100'
}

export const useMarkerPercentage = (percentage: number): Percentage => {
  if (percentage < CROWDFOUNDING_RANGES.starting.max) {
    return Percentage.thirty
  } else if (percentage < CROWDFOUNDING_RANGES.middle.max){
    return Percentage.fifty
  } else if (percentage < CROWDFOUNDING_RANGES.finishing.max){
    return Percentage.seventy
  }
  return Percentage.full
}

export type Color = { textColor: string, border: string, bg: string }
export const ICON_COLORS: Record<MarkerColor, Color> = {
  brand: { textColor: 'text-brand-button', border: 'border-brand-base', bg: 'bg-brand-button' },
  black: { textColor: 'text-gray-700', border: 'border-gray-800', bg: 'bg-gray-700/30' },
  pink: { textColor: 'text-pink-900', border: 'border-pink-800', bg: 'bg-pink-500' },
  green: { textColor: 'text-green-800', border: 'border-green-800', bg: 'bg-green-500' },
  blue: { textColor: 'text-blue-800', border: 'border-blue-800', bg: 'bg-blue-500' },
  yellow: { textColor: 'text-yellow-800', border: 'border-yellow-800', bg: 'bg-yellow-500' },
  red: { textColor: 'text-red-900', border: 'border-red-800', bg: 'bg-red-400' }
}

export enum MarkerSize { normal = 'normal', small = 'small' }
export type Props = {
  color: MarkerColor,
  size: MarkerSize
  percentage: Percentage,
  iconKey: CategoryIcon
  isSelected: boolean,
  withArrow: boolean
}
const Marker = ({ color, percentage = Percentage.full, iconKey, size, isSelected, withArrow }: Props) => {
  const { bg, textColor, border } = ICON_COLORS[color]
  const percentages = [30, 50, 70, 100]
  return (
    <div
      className={
        cn(
          'relative rounded-full shadow-sm',
          {
            'h-10 w-10': size === 'normal',
            'h-6 w-6': size === 'small',
            [bg]: isSelected,
            [border]: isSelected
          }
        )
      }
    >
      <div
        className={
          cn(
            'bg-white overflow-hidden rounded-full absolute inset-0 z-10 flex items-center justify-center border',
            {
              [border]: isSelected,
              'bg-gray-100 border border-gray-500/30': !isSelected
            }
          )
        }
      >
        {isSelected ? (
          <>
            <div
              className={
                cn(
                  'z-0 rounded-full absolute inset-0 bg-opacity-10',
                  { [bg]: isSelected }
                )
              }
            />
            <div
              style={{ height: `${percentage}%` }}
              className={
                cn(
                  'z-10 absolute left-0 right-0 bottom-0',
                  { [bg]: isSelected }
                )
              }
            />
          </>
        ): null}
        <i
          className={
            cn(
              'relative z-20 fas',
              ICONS[iconKey],
              {
                'text-base': size === 'normal',
                'text-xs p-2': size === 'small',
                [textColor]: isSelected,
                'text-gray-400': !isSelected
              }
            )
          }
        />
      </div>
      {(withArrow && size === 'normal') ? (
        <div className='z-0 pointer-events-none h-2 w-10 -bottom-2 absolute flex justify-center'>
          <div
            className={
              cn(
                '-mt-2 p-1 w-3 h-3 -ml-0.5 border rounded-sm transform rotate-45',
                {
                  [bg]: isSelected,
                  [border]: isSelected,
                  'bg-gray-300 border-gray-700/60': !isSelected
                }
              )
            }
          />
        </div>
      ): null}
    </div>
  )
}

export default Marker
