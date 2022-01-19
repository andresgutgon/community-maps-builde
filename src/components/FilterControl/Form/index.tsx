import { Dispatch, SetStateAction } from 'react'
import cn from 'classnames'
import { FormattedMessage } from 'react-intl'
import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/outline'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import type { Category as CategoryType } from '@maps/types/index'
import { useMapData } from '@maps/components/CommunityProvider'
import Button, { Size as ButtonSize, Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import useQueryString  from '@maps/components/CommunityProvider/useQueryString'
import Fieldset from '@maps/components/Fieldset'
import Marker, { Percentage, MarkerColor, MarkerSize }from '@maps/components/Marker'
import useFilters, { useShowFiltersWithDefaults, State } from '../useFilters'
import StateLabel from '../StateLabel'

type Props = {
  currentState: State,
  states: State[]
  categorySlugs: string[]
  setState: Dispatch<SetStateAction<State>>
  setSelectedCategories: Dispatch<SetStateAction<string[]>>
  onToggleFilters: () => void
}
const FilterForm = ({
  currentState,
  states,
  categorySlugs,
  setState,
  setSelectedCategories,
  onToggleFilters
}: Props) => {
  const { changeFiltersInUrl } = useQueryString()
  const styles = useStyles()
  const { allPlaces, setPlaces, categories, config } = useMapData()
  const showFilters = useShowFiltersWithDefaults(config.showFilters)
  const { filterPlaces } = useFilters()
  const onFilterSubmit = () => {
    const filters = { state: currentState, categories: categorySlugs }
    setPlaces(filterPlaces({
      places: allPlaces,
      filters,
      showFilters
    }))
    changeFiltersInUrl(filters)
    onToggleFilters()
  }
  const onCategoryToggle = (slug: string) => {
    setSelectedCategories(
      categorySlugs.includes(slug)
        ?  categorySlugs.filter(i => i !== slug)
        : [ ...categorySlugs, slug]
    )
  }
  return (
    <div className={cn('overflow-y-auto max-h-[440px] xs:max-h-[500px] sm:max-h-[1000px]', styles.verticalLayout)}>
      {states.length > 1 ? (
        <Fieldset legend={<FormattedMessage defaultMessage='Por estado' id="GI//kj" />}>
          <ul className='xs:grid xs:grid-cols-2 sm:grid-cols-3 xs:gap-2'>
            {states.map((state: State) => (
              <li className='h-full w-full flex' key={state}>
                <label
                  htmlFor={state}
                  className={
                    cn(
                      'w-full p-2 cursor-pointer  rounded border border-transparent',
                      'hover:shadow-sm hover:border-gray-300',
                      { 'shadow-sm bg-white border-gray-300': state === currentState }
                    )
                  }
                >
                  <input
                    id={state}
                    type='radio'
                    className='hidden'
                    checked={state === currentState}
                    onChange={() => setState(state)}
                    value={state}
                  />
                  <StateLabel showDescription={false} state={state} />
                </label>
              </li>
            ))}
          </ul>
        </Fieldset>
      ) : null}
      {(showFilters.categories && categories.length > 1) ? (
        <Fieldset legend={<FormattedMessage defaultMessage='Por categoría' id='7AAm0o' />}>
          <ul className='flex space-x-2'>
            {categories.map((category: CategoryType) => {
              const isSelected = categorySlugs.includes(category.slug)
              return (
                <li
                  key={category.slug}
                  onClick={() => onCategoryToggle(category.slug)}
                  className='cursor-pointer relative'
                >
                  <div
                    className={
                      cn(
                        'bg-gray-600 z-20 font-medium border-2 border-white/80 flex items-center justify-center absolute -top-2 -right-2 w-6 h-6 shadow rounded-full'
                      )
                    }
                  >
                    {isSelected ? (
                      <MinusSmIcon className="h-3 w-3 text-white" aria-hidden="true" />
                    ) : (
                      <PlusSmIcon className="h-3 w-3 text-white" aria-hidden="true" />
                    )}
                  </div>
                  <Marker
                    withArrow={false}
                    percentage={Percentage.full}
                    color={category.iconColor || MarkerColor.brand}
                    size={MarkerSize.normal}
                    isSelected={isSelected}
                    iconKey={category.iconKey}
                  />
                </li>
              )
            })}
          </ul>
        </Fieldset>
      ) : null}
      <div className='sticky bottom-0 flex justify-end'>
        <Button
          onClick={onFilterSubmit}
          size={ButtonSize.sm}
          type={ButtonType.button}
          style={ButtonStyles.branded}
        >
          <FormattedMessage defaultMessage='Filtrar' id="VTfGzG" />
        </Button>
      </div>
    </div>
  )
}

export default FilterForm
