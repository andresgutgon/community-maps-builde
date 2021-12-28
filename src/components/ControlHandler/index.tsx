import { ReactNode } from 'react'
import cn from 'classnames'

type Props = {
  expanded: boolean
  icon: string
  label: string
  children?: ReactNode | null
}
const ControlHandler = ({ expanded = false, icon, label, children }: Props) => {
  return (
    <div className='flex flex-row justify-between items-center space-x-4'>
      <div className='flex-0 flex flex-row items-center space-x-1'>
        <div className='fas fa-filter' />
        <span className={cn('font-medium', { 'text-lg': expanded })}>
          {label}
        </span>
      </div>
      {children}
    </div>

  )
}

export default ControlHandler
