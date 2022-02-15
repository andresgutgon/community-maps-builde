import { useMemo } from 'react'
import cn from 'classnames'
import { useIntl, FormattedMessage } from 'react-intl'
import { XIcon } from '@heroicons/react/outline'

import type { Category as CategoryType } from '@maps/types/index'
import { useMapData } from '@maps/components/CommunityProvider'
import ControlHandler from '@maps/components/ControlHandler'

import Marker, {
  Percentage,
  MarkerColor,
  MarkerSize
} from '@maps/components/Marker'
import StateLabel from '../StateLabel'
import { useShowFiltersWithDefaults, State } from '../useFilters'

const FilterDisplay = ({
  open,
  statusStates,
  unfilteredCrowdfundingStates,
  crowdfundingStates,
  state,
  onToggleFilters,
  categorySlugs
}) => {
  const intl = useIntl()
  const { allPlaces, places, categories, config } = useMapData()
  const showFilters = useShowFiltersWithDefaults(config.showFilters)
  const selectedCategories = useMemo(
    () =>
      categories.filter((c: CategoryType) => categorySlugs.includes(c.slug)),
    [categories, categorySlugs]
  )
  const showCategoriesFilter =
    categories.length > 1 && selectedCategories.length !== categories.length
  const showCategories = showCategoriesFilter && showFilters.categories
  const showStatus = statusStates.length > 0 && state === State.active
  const showCrowdfunding =
    crowdfundingStates.length > 0 &&
    unfilteredCrowdfundingStates.includes(state)
  const show = showCategories || showCrowdfunding || showStatus
  const label = intl.formatMessage({
    id: '4kF+sS',
    defaultMessage: 'Filtrar lugares'
  })
  const allVisible = places.length === allPlaces.length
  return (
    <button onClick={onToggleFilters} className='w-full'>
      <ControlHandler icon='fa-filter' label={label} expanded={open}>
        {!open ? (
          allPlaces.length > 0 ? (
            <div
              className={cn(
                'justify-end text-center flex py-1 px-2 rounded-full font-medium',
                {
                  'bg-brand-button text-brand-button': allVisible,
                  'bg-gray-200 text-gray-600': !allVisible
                }
              )}
            >
              {allVisible
                ? places.length
                : intl.formatMessage(
                    { id: 'iB0EB1', defaultMessage: '{filter} de {total}' },
                    { filter: places.length, total: allPlaces.length }
                  )}
            </div>
          ) : null
        ) : (
          <>
            <span className='sr-only'>
              <FormattedMessage defaultMessage='Cerrar filtros' id='Kdq+g3' />
            </span>
            <XIcon className='h-6 w-6 text-gray-600' aria-hidden='true' />
          </>
        )}
      </ControlHandler>
      {!open && show ? (
        <div className='flex-1 flex flex-col space-y-1 sm:space-y-2 border-t border-gray-100 mt-2 pt-2'>
          {showCrowdfunding || showStatus ? (
            <StateLabel showDescription state={state} />
          ) : null}
          {showCategories ? (
            <ul className='flex flex-row space-x-1'>
              {categories.map((category: CategoryType) => (
                <li key={category.slug}>
                  <Marker
                    active
                    withArrow={false}
                    percentage={Percentage.full}
                    color={category.iconColor || MarkerColor.brand}
                    size={MarkerSize.small}
                    isSelected={categorySlugs.includes(category.slug)}
                    iconKey={category.iconKey}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </button>
  )
}

export default FilterDisplay
