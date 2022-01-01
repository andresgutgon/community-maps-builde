import { Dispatch, SetStateAction, useRef } from 'react'
import cn from 'classnames'
import { useIntl, FormattedMessage } from 'react-intl'
import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/outline'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import type { Category as CategoryType } from '@maps/types/index'
import { useMapData } from '@maps/components/CommunityProvider'
import Slider, { Color } from '@maps/components/Slider'
import Button, { Size as ButtonSize, Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import useQueryString  from '@maps/components/CommunityProvider/useQueryString'

import Marker, { Percentage, MarkerColor, MarkerSize }from '@maps/components/Marker'
import useFilters, { FINANCING_RANGES, FinancingState, ActiveState } from '../useFilters'
import { FinancingLabels } from '../useFinancingLabels'
import FinancingLabel from '../FinancingLabel'

type Props = {
  activeState: ActiveState,
  financingState: FinancingState,
  categorySlugs: string[],
  setActiveState: Dispatch<SetStateAction<ActiveState>>,
  setFinancingState: Dispatch<SetStateAction<FinancingState>>,
  setSelectedCategories: Dispatch<SetStateAction<string[]>>,
  onToggleFilters: () => void
}
const FilterForm = ({
  activeState,
  financingState,
  categorySlugs,
  setActiveState,
  setFinancingState,
  setSelectedCategories,
  onToggleFilters
}: Props) => {
  const intl = useIntl()
  const { changeFiltersInUrl } = useQueryString()
  const styles = useStyles()
  const { allPlaces, places, setPlaces, categories, config } = useMapData()
  const { filter } = useFilters()
  const activationStates = useRef<ActiveState[]>([ActiveState.all, ActiveState.active, ActiveState.inactive]).current
  const financingStates = useRef<FinancingState[]>([
    FinancingState.anyFinancingState,
    FinancingState.starting,
    FinancingState.middle,
    FinancingState.finishing,
    FinancingState.completed
  ]).current
  const activeStateLabels = useRef<Record<ActiveState, string>>({
    [ActiveState.all]: intl.formatMessage({ defaultMessage: 'Todos', id: 'P8VfZA' }),
    [ActiveState.active]: intl.formatMessage({ defaultMessage: 'Activos', id: 'GbLpqH' }),
    [ActiveState.inactive]: intl.formatMessage({ defaultMessage: 'Inactivos', id: 'ZNZWBc' })
  }).current
  const onFilterSubmit = () => {
    const filters = { activeState, financingState, categories: categorySlugs }
    setPlaces(filter(allPlaces, filters))
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
  const onActiveStateChange = (activeState: ActiveState) => {
    // We only allow to set FinancingState when viewing inactive places.
    // Doesn't make sense to hide active places based on financing state.
    // An active place is already running.
    if (activeState !== ActiveState.inactive) {
      setFinancingState(FinancingState.anyFinancingState)
    }
    setActiveState(activeState)
  }
  return (
    <div className={cn('overflow-y-auto max-h-[440px] xs:max-h-[500px] sm:max-h-[1000px]', styles.verticalLayout)}>
      <fieldset className={styles.group.layout}>
        <legend className={styles.group.label}>
          <FormattedMessage defaultMessage='Por estado' id='GI//kj' />
        </legend>
        <ul className={styles.radio.wrap}>
          {activationStates.map((state: ActiveState) =>
            <li key={state}>
              <label htmlFor={state} className={styles.radio.option}>
                <input
                  id={state}
                  type='radio'
                  className={styles.radio.input}
                  checked={activeState === state}
                  onChange={() => onActiveStateChange(state)}
                  value={state}
                />
                <span className={styles.radio.label}>{activeStateLabels[state]}</span>
              </label>
            </li>
          )}
        </ul>
      </fieldset>
      {activeState === ActiveState.inactive ? (
        <fieldset className={styles.group.layout}>
          <legend className={styles.group.label}>
            <FormattedMessage defaultMessage='Por porcentaje de aportación' id="TGWZPT" />
          </legend>
          <ul className='xs:grid xs:grid-cols-2 sm:grid-cols-3 xs:gap-2'>
            {financingStates.map((state: FinancingState) => (
              <li className='h-full w-full flex' key={state}>
                <label
                  htmlFor={state}
                  className={
                    cn(
                      'w-full p-2 cursor-pointer  rounded border border-transparent',
                      'hover:shadow-sm hover:border-gray-300',
                      { 'shadow-sm bg-white border-gray-300': financingState === state }
                    )
                  }
                >
                  <input
                    id={state}
                    type='radio'
                    className='hidden'
                    checked={financingState === state}
                    onChange={() => setFinancingState(state)}
                    value={state}
                  />
                  <FinancingLabel financingState={state} />
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ): null}
      {categories.length > 1 ? (
        <fieldset className={styles.group.layout}>
          <legend className={styles.group.label}>
            <FormattedMessage defaultMessage='Por categoría' id='7AAm0o' />
          </legend>
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
                    color={MarkerColor.black}
                    size={MarkerSize.normal}
                    isSelected={isSelected}
                    iconKey={category.iconKey}
                  />
                </li>
              )
            })}
          </ul>
        </fieldset>
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
