import cn from 'classnames'

import { FinancingState } from '@maps/components/FilterControl/useFilters'
import type { CategoryIcon } from '@maps/types/index'
import { FINANCING_STATE_COLORS } from '@maps/components/FilterControl/FinancingLabel'
import { ICONS } from '@maps/lib/icons'

export enum MarkerGenericType {
  brand = 'brand',
  black = 'black',
  active = 'active'
}
export type MarkerType = FinancingState | MarkerGenericType

const { anyFinancingState, starting, middle, finishing, completed } = FINANCING_STATE_COLORS
export type Color = { textColor: string, border: string, bg: string }
export const ICON_COLORS: Record<MarkerType, Color> = {
  ...FINANCING_STATE_COLORS as Record<MarkerType, Color>,
  brand: { textColor: 'text-brand-button', border: 'border-brand-base/30', bg: 'bg-brand-button' },
  active: { textColor: 'text-green-700/60', border: 'border-green-800/40', bg: 'bg-green-200' },
  black: { textColor: 'text-gray-200', border: 'border-gray-300/30', bg: 'bg-gray-800' }
}

export enum MarkerSize { normal = 'normal', small = 'small' }
export type Props = {
  type: MarkerType,
  size: MarkerSize
  iconKey: CategoryIcon
  isSelected: boolean,
  withArrow: boolean
}
const Marker = ({ type, iconKey, size, isSelected, withArrow }: Props) => {
  const { bg, textColor, border } = ICON_COLORS[type]
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
            'rounded-full absolute inset-0 z-10 flex items-center justify-center border',
            {
              [bg]: isSelected,
              [border]: isSelected,
              'bg-gray-100 border border-gray-500/30': !isSelected
            }
          )
        }
      >
        <i className={
          cn(
            'fas text-opacity-90',
            ICONS[iconKey],
            {
              'text-base': size === 'normal',
              'text-xs p-2': size === 'small',
              [textColor]: isSelected,
              'text-gray-400': !isSelected
            }
          )}
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
