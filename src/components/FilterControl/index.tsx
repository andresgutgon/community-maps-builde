import { useState } from 'react'
import cn from 'classnames'
import { FormattedMessage } from 'react-intl'

import ReactControl from '@maps/components/ReactControl/index'

const FilterControl = () => {
  const [open, setOpen] = useState(false)
  const onClickIcon = () => {
    setOpen(true)
  }
  return (
    <ReactControl
      position='topleft'
      className={
        cn('transition-width flex items-center justify-center',
          {
            'leaflet-expanded-control': open
          }
        )
      }
    >
      {open ? (
        <div>Hola</div>
      ): (
        <button onClick={onClickIcon} className='flex flex-row items-center space-x-1'>
          <div className='fas fa-filter' />
          <span className='font-medium'>
            <FormattedMessage defaultMessage='Filtrar lugares' id='4kF+sS' />
          </span>
        </button>
      )}
    </ReactControl>
  )
}

export default FilterControl
