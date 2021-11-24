import cn from 'classnames'

import { Category } from '@maps/types/index'

type SVGIconProps = { progress: number, icon: string }
export const Icon = ({ progress, icon }: SVGIconProps) =>
  <div className='h-10 w-10 relative rounded bg-gray-900 drop-shadow-xl flex items-center justify-center'>
    <i className={cn('fas text-white text-base', icon)} />
    <div className='pointer-events-none overflow-hidden h-2 w-8 -bottom-2 absolute flex justify-center'>
      <div className='-mt-2 p-1 w-3 h-3 rounded-sm bg-gray-900 drop-shadow-xl transform rotate-45' />
    </div>
  </div>

Icon.defaultProps = { progress: 0 }

// Font Awesome v.6 icons
// Look for more here:
// https://fontawesome.com/v5.15/icons?d=gallery&p=2&s=regular&m=free
export const ICONS: Record<Category, string> = {
  [Category.car]: 'fa-car',
  [Category.van]: 'fa-shuttle-van',
  [Category.car_charger]: 'fa-bolt',
  [Category.bike_charger]: 'fa-bicycle'
}

