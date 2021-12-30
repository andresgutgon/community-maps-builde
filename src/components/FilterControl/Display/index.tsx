import { useMemo } from 'react'
import cn from 'classnames'
import { useIntl, FormattedMessage } from 'react-intl'
import { XIcon } from '@heroicons/react/outline'

import type { Category as CategoryType } from '@maps/types/index'
import { useMapData } from '@maps/components/CommunityProvider'
import ControlHandler from '@maps/components/ControlHandler'

import Marker, { MarkerGenericType, MarkerType, MarkerSize }from '@maps/components/Marker'
import FinancingLabel from '../FinancingLabel'
import { FINANCING_RANGES, FinancingState, ActiveState } from '../useFilters'

type Props = {
  open: boolean,
  activeState: ActiveState,
  financingState: FinancingState,
  categorySlugs: string[]
  onToggleFilters: () => void
}
const FilterDisplay = ({
  open,
  activeState,
  financingState,
  onToggleFilters,
  categorySlugs
}) => {
  const intl = useIntl()
  const { allPlaces, places, categories } = useMapData()
  const selectedCategories = useMemo(() =>
    categories.filter((c: CategoryType) => categorySlugs.includes(c.slug))
  , [categories, categorySlugs])
  const activePlacesLabel = intl.formatMessage({ id: 'GSkc36', defaultMessage: 'Lugares activos' })
  const inactivePlacesLabel = intl.formatMessage({ id: 'An+6PB', defaultMessage: 'Lugares inactivos' })
  const showStateFilter = activeState !== ActiveState.all
  const financingRange = FINANCING_RANGES[financingState]
  const showFinancingFilter = activeState !== ActiveState.active && !!financingRange
  const showCategoriesFilter = categories.length > 1 && selectedCategories.length !== categories.length
  const showFilters = showStateFilter || showFinancingFilter || showCategoriesFilter
  const label = intl.formatMessage({ id: '4kF+sS', defaultMessage: 'Filtrar lugares' })
  return (
    <button onClick={onToggleFilters} className='w-full'>
      <ControlHandler
        icon='fa-filter'
        label={label}
        expanded={open}
      >
        {!open ? (
          allPlaces.length > 0 ? (
            <div className='justify-end text-center flex py-1 px-2 rounded-full bg-gray-200 font-medium text-gray-600'>
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
      </ControlHandler>
      {(!open && showFilters) ? (
        <div className='flex-1 flex flex-col space-y-1 sm:space-y-2 border-t border-gray-100 mt-2 pt-2'>
          {showStateFilter ? (
            <div className='flex flex-row items-center space-x-2'>
              <div className='w-6 h-6 flex items-center justify-center'>
                <div className={
                  cn(
                    'rounded-full h-3 w-3',
                    {
                      'bg-green-600': activeState === ActiveState.active,
                      'bg-blue-300': activeState === ActiveState.inactive
                    }
                  )}
                />
              </div>
              <span className='ml-2 text-xs text-gray-900'>
                {activeState === ActiveState.active ? activePlacesLabel : inactivePlacesLabel}
              </span>
            </div>
          ) : null}
          {showFinancingFilter ? (
            <FinancingLabel showDescription financingState={financingState} />
          ) : null}
          {showCategoriesFilter ? (
            <ul className='flex flex-row space-x-1'>
              {categories.map((category: CategoryType) =>
                <li key={category.slug}>
                  <Marker
                    withArrow={false}
                    type={MarkerGenericType.black as MarkerType}
                    size={MarkerSize.small}
                    isSelected={categorySlugs.includes(category.slug)}
                    iconKey={category.iconKey}
                  />
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
