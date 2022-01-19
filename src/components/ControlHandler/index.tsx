import { ReactNode } from 'react'
import cn from 'classnames'

type Props = {
  icon: string
  label: string | ReactNode
  expanded?: boolean
  children?: ReactNode | null
}
const ControlHandler = ({ expanded = false, icon, label, children }: Props) => {
  const isString = typeof label === 'string'
  return (
    <div className='flex flex-row justify-between items-center space-x-4'>
      <div className='flex-0 flex flex-row items-center space-x-3'>
        <i className={cn('text-gray-800 ml-1 fas', icon)} />
        {isString ? (
          <span
            className={cn('text-gray-800 font-medium', { 'text-lg': expanded })}
          >
            {label}
          </span>
        ) : (
          label
        )}
      </div>
      {children}
    </div>
  )
}

export default ControlHandler
