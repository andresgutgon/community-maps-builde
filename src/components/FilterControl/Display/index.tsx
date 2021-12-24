import { useMemo } from 'react'
import cn from 'classnames'
import { useIntl, FormattedMessage } from 'react-intl'
import { XIcon } from '@heroicons/react/outline'

import type { Category as CategoryType } from '@maps/types/index'
import { useMapData } from '@maps/components/CommunityProvider'
import ProgressIndicator from '@maps/components/ProgressIndicator'

import Category from '../Category'
import { ActiveState } from '../useFilters'

type Props = {
  open: boolean,
  percentageLabel: string,
  percentage: number,
  activeState: ActiveState,
  categorySlugs: string[]
  onToggleFilters: () => void
}
const FilterDisplay = ({
  open,
  activeState,
  onToggleFilters,
  categorySlugs,
  percentageLabel,
  percentage
}) => {
  const intl = useIntl()
  const { allPlaces, places, categories } = useMapData()
  const selectedCategories = useMemo(() =>
    categories.filter((c: CategoryType) => categorySlugs.includes(c.slug))
  , [categories, categorySlugs])
  const activePlacesLabel = intl.formatMessage({ id: 'GSkc36', defaultMessage: 'Lugares activos' })
  const inactivePlacesLabel = intl.formatMessage({ id: 'An+6PB', defaultMessage: 'Lugares inactivos' })
  return (
    <button onClick={onToggleFilters} className='w-full'>
      <div className='flex flex-row justify-between items-center space-x-4'>
        <div className='flex-0 flex flex-row items-center space-x-1'>
          <div className='fas fa-filter' />
          <span className={cn('font-medium', { 'text-lg': open })}>
            <FormattedMessage defaultMessage='Filtrar lugares' id='4kF+sS' />
          </span>
        </div>
        {!open ? (
          allPlaces.length > 0 ? (
            <div className='flex-1 justify-end text-center flex py-1 px-2 rounded-full bg-gray-200 font-medium text-gray-600'>
              {places.length === allPlaces.length
                ? places.length
                : intl.formatMessage(
                    { id: 'iB0EB1', defaultMessage: '{filter} de {total}' },
                    { filter: places.length, total: allPlaces.length }
                  )
              }
            </div>
          ) : null
        ) : (
          <>
            <span className='sr-only'>
              <FormattedMessage defaultMessage='Cerrar filtros' id='Kdq+g3' />
            </span>
            <XIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
          </>
        )}
      </div>

      {(!open && allPlaces.length !== places.length) ? (
        <div className='flex-1 flex flex-col space-y-3 border-t border-gray-100 mt-2 pt-2'>
          {activeState !== ActiveState.all ? (
            <div className='flex flex-row items-center space-x-2 ml-1'>
              <div className={
                cn(
                  'rounded-full h-2 w-2 ring-4',
                  {
                    'bg-green-600 ring-green-100': activeState === ActiveState.active,
                    'bg-yellow-600 ring-yellow-200': activeState === ActiveState.inactive
                  }
                )}
              />
              <span className='text-xs font-medium text-gray-900'>
                {activeState === ActiveState.active ? activePlacesLabel : inactivePlacesLabel}
              </span>
            </div>
          ) : null}
          {percentage > 0 ? (
            <div className='flex flex-row space-x-1'>
              <div className='w-1/2'>
                <ProgressIndicator value={percentage} size='small' />
              </div>
              <span className='flex-1 text-xs font-medium text-gray-900'>{percentageLabel}</span>
            </div>
          ) : null}
          {categories.length > 1 ? (
            <ul className='flex flex-row space-x-1'>
              {selectedCategories.map((category: CategoryType) =>
                <li key={category.slug}>
                  <Category size='small' isSelected category={category} />
                </li>
              )}
            </ul>
          ) : null}
        </div>
      ) : null}
    </button>
  )
}

export default FilterDisplay
