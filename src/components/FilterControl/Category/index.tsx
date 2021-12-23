import cn from 'classnames'

import type { Category as CategoryType } from '@maps/types/index'
import { ICONS } from '@maps/lib/icons'
import { ICON_COLORS } from '@maps/components/Place/buildIcon'

type Props = {
  size: 'normal' | 'small'
  category: CategoryType,
  isSelected: boolean,
  onClick?: () => void
}
const Category = ({ onClick, category, size, isSelected }: Props) => {
  const icon = ICONS[category.iconKey] || ICONS[ICONS.car]
  const color = ICON_COLORS[category.iconColor]
  const className = cn(
    'relative rounded-full',
    {
      'h-10 w-10': size === 'normal',
      'h-6 w-6': size === 'small',
      [color.bg]: isSelected,
      [color.border]: isSelected,
      'opacity-100 shadow-md border-2': isSelected,
      'opacity-60 hover:opacity-100 bg-gray-300 border-gray-900': !isSelected
    }
  )
  const renderIcon = () =>
    <div
      className={
        cn(
          'rounded-full absolute inset-0 z-10 flex items-center justify-center',
          {
            [color.bg]: isSelected,
            'border border-white border-opacity-75': size === 'normal' && isSelected
          }
        )
      }
    >
      <i className={
        cn(
          'fas text-opacity-90', icon,
          {
            'text-base': size === 'normal',
            'text-xs p-2': size === 'small',
            [color.icon]: isSelected,
            'text-gray-800': !isSelected

          }
        )}
      />
    </div>

  if (!onClick) return <div className={className}>{renderIcon()}</div>

  return (
    <button onClick={onClick} className={className}>
      {renderIcon()}
    </button>
  )
}

export default Category
