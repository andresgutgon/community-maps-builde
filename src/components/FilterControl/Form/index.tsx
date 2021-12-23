import cn from 'classnames'
import { Dispatch, SetStateAction, useRef } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { XIcon, PlusSmIcon } from '@heroicons/react/outline'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import type { Category as CategoryType } from '@maps/types/index'
import { useMapData } from '@maps/components/CommunityProvider'
import Slider, { Color } from '@maps/components/Slider'
import Button, { Size as ButtonSize, Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'

import useFilters, { ActiveState } from '../useFilters'
import Category from '../Category'

type Props = {
  percentageLabel: string
  percentage: number,
  activeState: ActiveState,
  categorySlugs: string[],
  setSelectedCategories: Dispatch<SetStateAction<string[]>>,
  setPercentage: Dispatch<SetStateAction<number>>,
  setState: Dispatch<SetStateAction<ActiveState>>,
  onToggleFilters: () => void
}
const FilterForm = ({
  percentageLabel,
  percentage,
  setPercentage,
  activeState,
  setState,
  categorySlugs,
  setSelectedCategories,
  onToggleFilters
}: Props) => {
  const intl = useIntl()
  const styles = useStyles()
  const { allPlaces, places, setPlaces, categories, config } = useMapData()
  const { filter } = useFilters()
  const states = useRef<ActiveState[]>([ActiveState.all, ActiveState.active, ActiveState.inactive]).current
  const stateLabels = useRef<Record<ActiveState, string>>({
    [ActiveState.all]: intl.formatMessage({ defaultMessage: 'Todos', id: 'P8VfZA' }),
    [ActiveState.active]: intl.formatMessage({ defaultMessage: 'Activos', id: 'GbLpqH' }),
    [ActiveState.inactive]: intl.formatMessage({ defaultMessage: 'Inactivos', id: 'ZNZWBc' })
  }).current
  const onFilterSubmit = () => {
    const filteredPlaces = filter(
      allPlaces,
      { activeState, categories: categorySlugs, percentage }
    )
    setPlaces(filteredPlaces)
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
    <div className={styles.verticalLayout}>
      <fieldset className={styles.group.layout}>
        <legend className={styles.group.label}>
          <FormattedMessage defaultMessage='Por estado' id='GI//kj' />
        </legend>
        <ul className={styles.radio.wrap}>
          {states.map((state: ActiveState) =>
            <li key={state}>
              <label htmlFor={state} className={styles.radio.option}>
                <input
                  id={state}
                  type='radio'
                  className={styles.radio.input}
                  checked={activeState === state}
                  onChange={() => setState(state)}
                  value={state}
                />
                <span className={styles.radio.label}>{stateLabels[state]}</span>
              </label>
            </li>
          )}
        </ul>
      </fieldset>
      <fieldset className={styles.group.layout}>
        <legend className={styles.group.label}>
          <FormattedMessage
            id='Hi7RCv'
            defaultMessage='Por porcentaje de contribución {value}'
            values={{
              value: (
                <span className='space-x-2 flex-inline flex-row'>
                  &#8212;&nbsp;
                  <strong className='text-gray-900 lowercase font-medium'>
                    {percentageLabel}
                  </strong>
                </span>
              )
            }}
          />
        </legend>
        <Slider
          color={Color.success}
          defaultValue={0}
          value={percentage}
          minimum={0}
          maximum={100}
          step={1}
          onChange={(value: number) => setPercentage(value)}
        />
      </fieldset>
      {categories.length > 1 ? (
        <fieldset className={styles.group.layout}>
          <legend className={styles.group.label}>
            <FormattedMessage defaultMessage='Por categoría' id='7AAm0o' />
          </legend>
          <ul className='flex space-x-2'>
            {categories.map((category: CategoryType) => {
              const isSelected = categorySlugs.includes(category.slug)
              return (
                <li className='relative' key={category.slug}>
                  <div
                    className={
                      cn(
                        'z-20 font-medium border-2 border-white/80 flex items-center justify-center absolute -top-2 -right-2 w-6 h-6 shadow rounded-full',
                        {
                          'bg-red-600': isSelected,
                          'bg-green-600': !isSelected
                        }
                      )
                    }
                  >
                    {isSelected ? (
                      <XIcon className="h-3 w-3 text-white" aria-hidden="true" />
                    ) : (
                      <PlusSmIcon className="h-3 w-3 text-white" aria-hidden="true" />
                    )}
                  </div>
                  <Category
                    size='normal'
                    category={category}
                    isSelected={isSelected}
                    onClick={() => onCategoryToggle(category.slug)}
                  />
                </li>
              )
            })}
          </ul>
        </fieldset>
      ) : null}
      <div className='flex justify-end'>
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
