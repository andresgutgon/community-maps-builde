import { Dispatch, SetStateAction } from 'react'
import cn from 'classnames'
import { FormattedMessage } from 'react-intl'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import type { Category as CategoryType } from '@maps/types/index'
import type { FilterGroup as FilterGroupType } from '@maps/types/index'
import type { Filter as FilterType } from '@maps/types/index'
import { useMapData } from '@maps/components/CommunityProvider'
import Button, {
  Size as ButtonSize,
  Types as ButtonType,
  Styles as ButtonStyles
} from '@maps/components/Button'
import useQueryString from '@maps/components/CommunityProvider/useQueryString'
import Fieldset from '@maps/components/Fieldset'
import Marker, {
  Percentage,
  MarkerColor,
  MarkerSize
} from '@maps/components/Marker'
import useFilters, { useShowFiltersWithDefaults, State } from '../useFilters'
import StateLabel from '../StateLabel'

type Props = {
  currentState: State
  states: State[]
  categorySlugs: string[]
  filterGroupSlugs: string[]
  setState: Dispatch<SetStateAction<State>>
  setSelectedCategories: Dispatch<SetStateAction<string[]>>
  onToggleFilters: () => void
}
const FilterForm = ({
  currentState,
  states,
  categorySlugs,
  filterGroupSlugs,
  setState,
  setSelectedCategories,
  onToggleFilters
}: Props) => {
  const { changeFiltersInUrl } = useQueryString()
  const styles = useStyles()
  const { allPlaces, setPlaces, categories, customFilterGroupsData, config } =
    useMapData()
  const showFilters = useShowFiltersWithDefaults(config.showFilters)
  const { filterPlaces } = useFilters()
  const onFilterSubmit = () => {
    const filters = {
      state: currentState,
      categories: categorySlugs,
      custom: filterGroupSlugs
    }
    setPlaces(
      filterPlaces({
        places: allPlaces,
        filters,
        showFilters
      })
    )
    changeFiltersInUrl(filters)
    onToggleFilters()
  }
  const onCategoryToggle = (slug: string) => {
    setSelectedCategories(
      categorySlugs.includes(slug)
        ? categorySlugs.filter((i) => i !== slug)
        : [...categorySlugs, slug]
    )
  }
  return (
    <div
      className={cn(
        'overflow-y-auto max-h-[440px] xs:max-h-[500px] sm:max-h-[1000px]',
        styles.verticalLayout
      )}
    >
      {customFilterGroupsData.map((group: FilterGroupType) => {
        return (
          <Fieldset legend={group.name} key={group.slug}>
            <ul className='xs:grid xs:grid-cols-2 sm:grid-cols-3 xs:gap-2'>
              {group.filters.map((filter: FilterType) => {
                // console.log('filterGroupSlugs')
                // console.log(filterGroupSlugs)
                return (
                  <li
                    key={filter.slug}
                    className='h-full w-full flex cursor-pointer relative'
                  >
                    <label
                      className={cn(
                        'w-full p-2 cursor-pointer  rounded border border-transparent',
                        'hover:shadow-sm hover:border-gray-300'
                      )}
                    >
                      <div className='flex md:items-center'>
                        <Marker
                          active
                          withArrow={false}
                          percentage={Percentage.full}
                          color={MarkerColor.brand}
                          size={MarkerSize.normal}
                          isSelected={true}
                          iconKey={false}
                          isFilter={true}
                        />
                        <div className='flex-0 flex sm:flex-col ml-2 flex-row items-center sm:items-start'>
                          <div className='text-sm text-gray-800 cursor-pointer sm:font-medium text-xs sm:text-sm'>
                            {filter.name}
                          </div>
                        </div>
                      </div>
                    </label>
                  </li>
                )
              })}
            </ul>
          </Fieldset>
        )
      })}
      {states.length > 1 ? (
        <Fieldset
          legend={<FormattedMessage defaultMessage='Por estado' id='GI//kj' />}
        >
          <ul className='xs:grid xs:grid-cols-2 sm:grid-cols-3 xs:gap-2'>
            {states.map((state: State) => (
              <li className='h-full w-full flex' key={state}>
                <label
                  htmlFor={state}
                  className={cn(
                    'w-full p-2 cursor-pointer  rounded border border-transparent',
                    'hover:shadow-sm hover:border-gray-300',
                    {
                      'shadow-sm bg-white border-gray-300':
                        state === currentState
                    }
                  )}
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
      {showFilters.categories && categories.length > 1 ? (
        <Fieldset
          legend={
            <FormattedMessage defaultMessage='Por categoría' id='7AAm0o' />
          }
        >
          <ul className='xs:grid xs:grid-cols-2 sm:grid-cols-3 xs:gap-2'>
            {categories.map((category: CategoryType) => {
              // console.log('CATEGORIES IN FORM')
              // console.log(categorySlugs)
              const isSelected = categorySlugs.includes(category.slug)
              return (
                <li
                  key={category.slug}
                  onClick={() => onCategoryToggle(category.slug)}
                  className='h-full w-full flex cursor-pointer relative'
                >
                  <label
                    className={cn(
                      'w-full p-2 cursor-pointer  rounded border border-transparent',
                      'hover:shadow-sm hover:border-gray-300'
                    )}
                  >
                    <div className='flex md:items-center'>
                      <Marker
                        active
                        withArrow={false}
                        percentage={Percentage.full}
                        color={category.iconColor || MarkerColor.brand}
                        size={MarkerSize.normal}
                        isSelected={isSelected}
                        iconKey={category.iconKey}
                        isFilter={true}
                      />
                      <div className='flex-0 flex sm:flex-col ml-2 flex-row items-center sm:items-start'>
                        <div className='text-sm text-gray-800 cursor-pointer sm:font-medium text-xs sm:text-sm'>
                          {category.name}
                        </div>
                        <span className='text-xs text-gray-500 hidden sm:block'>
                          {category.description}
                        </span>
                      </div>
                    </div>
                  </label>
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
          <FormattedMessage defaultMessage='Filtrar' id='VTfGzG' />
        </Button>
      </div>
    </div>
  )
}

export default FilterForm
