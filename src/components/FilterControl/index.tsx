import { useMemo, useRef, useState } from 'react'
import cn from 'classnames'
import { useIntl, FormattedMessage } from 'react-intl'

import { XIcon } from '@heroicons/react/outline'
import ReactControl from '@maps/components/ReactControl/index'
import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import { useMapData } from '@maps/components/CommunityProvider'
import type { Category as CategoryType } from '@maps/types/index'
import { ICONS } from '@maps/lib/icons'
import { ICON_COLORS } from '@maps/components/Place/buildIcon'
import Slider, { Color } from '@maps/components/Slider'
import Button, { Size as ButtonSize, Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import ProgressIndicator from '@maps/components/ProgressIndicator'
import useFilters, { ActiveState } from './useFilters'

type CategoryProps = {
  size: 'normal' | 'small'
  category: CategoryType,
  isSelected: boolean,
  onClick?: () => void
}
const Category = ({ onClick, category, size, isSelected }: CategoryProps) => {
  const icon = ICONS[category.iconKey] || ICONS[ICONS.car]
  const color = ICON_COLORS[category.iconColor]
  const className = cn(
    'relative rounded-full',
    {
      'h-10 w-10': size === 'normal',
      'h-6 w-6': size === 'small',
      [color.bg]: isSelected,
      [color.border]: isSelected,
      'opacity-100 shadow-md border-2': isSelected,
      'opacity-60 hover:opacity-100 bg-gray-300 border-gray-900': !isSelected
    }
  )
  const renderIcon = () =>
    <div
      className={
        cn(
          'rounded-full absolute inset-0 z-10 flex items-center justify-center',
          {
            [color.bg]: isSelected,
            'border border-white border-opacity-75': size === 'normal' && isSelected
          }
        )
      }
    >
      <i className={
        cn(
          'fas text-opacity-90', icon,
          {
            'text-base': size === 'normal',
            'text-xs p-2': size === 'small',
            [color.icon]: isSelected,
            'text-gray-800': !isSelected

          }
        )}
      />
    </div>

  if (!onClick) return <div className={className}>{renderIcon()}</div>

  return (
    <button onClick={onClick} className={className}>
      {renderIcon()}
    </button>
  )
}

const FilterControl = () => {
  const intl = useIntl()
  const { filter } = useFilters()
  const { allPlaces, places, setPlaces, config } = useMapData()
  const categories = useRef<CategoryType[]>(Object.keys(config.categories).map((key: string) =>
    config.categories[key]
  )).current
  const styles = useStyles()
  const [open, setOpen] = useState(false)
  const defaultContributionPercentage = useRef(30).current

  // Initial Filter states
  // TODO: Pick from URL
  const [selectedCategoriesSlugs, setSelected] = useState<string[]>([])
  const [activeState, setCheckedState] = useState<ActiveState>(ActiveState.all)
  const [usingPercentage, setUsingPercentage] = useState<boolean>(false)
  const [contributionPercentage, setPercentage] = useState<number>(defaultContributionPercentage)

  const selectedCategories = useMemo(() =>
    categories.filter((c: CategoryType) => selectedCategoriesSlugs.includes(c.slug))
  , [categories, selectedCategoriesSlugs])
  const onClickIcon = () => { setOpen(!open) }
  const states = useRef<ActiveState[]>([ActiveState.all, ActiveState.active, ActiveState.inactive]).current
  const stateLabels = useRef<Record<ActiveState, string>>({
    [ActiveState.all]: intl.formatMessage({ defaultMessage: 'Todos', id: 'P8VfZA' }),
    [ActiveState.active]: intl.formatMessage({ defaultMessage: 'Activos', id: 'GbLpqH' }),
    [ActiveState.inactive]: intl.formatMessage({ defaultMessage: 'Inactivos', id: 'ZNZWBc' })
  }).current
  const onCategoryToggle = (slug: string) => {
    setSelected(
      selectedCategoriesSlugs.includes(slug)
        ?  selectedCategoriesSlugs.filter(i => i !== slug)
        : [ ...selectedCategoriesSlugs, slug]
    )
  }
  const onFilter = () => {
    const filteredPlaces = filter(
      allPlaces,
      {
        activeState,
        categories: selectedCategoriesSlugs,
        percentage: usingPercentage ? contributionPercentage : null

      }
    )
    setPlaces(filteredPlaces)
    setOpen(false)
  }
  const percentageLabel = intl.formatMessage(
    { id: 'VHf1xn', defaultMessage: '{percentage}% o más' },
    { percentage: contributionPercentage }
  )
  const activePlacesLabel = intl.formatMessage({ id: 'GSkc36', defaultMessage: 'Lugares activos' })
  const inactivePlacesLabel = intl.formatMessage({ id: 'An+6PB', defaultMessage: 'Lugares inactivos' })
  return (
    <ReactControl
      position='topleft'
      className={
        cn(
          'transition-width',
          {
            'flex items-center justify-center': !open,
            'flex-col leaflet-expanded-control': open
          }
        )
      }
    >
      <button onClick={onClickIcon} className='w-full'>
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
              <div className='flex flex-row items-center space-x-2'>
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
            {usingPercentage ? (
              <div className='flex flex-row space-x-1'>
                <div className='w-1/2'>
                  <ProgressIndicator value={contributionPercentage} size='small' />
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
      {open ? (
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
                      onChange={() => setCheckedState(state)}
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
                  value: usingPercentage ? (
                    <span className='space-x-2 flex-inline flex-row'>
                      &#8212;&nbsp;
                      <strong className='text-gray-900 lowercase font-medium'>
                        {percentageLabel}
                      </strong>
                      <button
                        className='underline text-gray-900'
                        onClick={() => setUsingPercentage(false)}
                      >
                        <FormattedMessage id='9k8eaA' defaultMessage='Cualquier porcentaje' />
                      </button>
                    </span>
                  ) : null
                }}
              />
            </legend>
            {usingPercentage ? (
              <Slider
                color={Color.success}
                defaultValue={defaultContributionPercentage}
                value={contributionPercentage}
                minimum={0}
                maximum={100}
                step={1}
                onChange={(value: number) => setPercentage(value)}
              />
              ) : (
                <p className='text-sm text-gray-700'>
                  <FormattedMessage
                    id='h1MxPq'
                    defaultMessage='Aparecen lugares con cualquier porcentaje de contribución. Puedes {link}'
                    values={{
                      link: <button
                        className='underline text-gray-900 lowercase'
                        onClick={() => setUsingPercentage(true)}
                      >
                        <FormattedMessage id='ccbOeF' defaultMessage='Definir un porcentaje' />
                      </button>
                    }}
                  />
                </p>
              )}
          </fieldset>
          {categories.length > 1 ? (
            <fieldset className={styles.group.layout}>
              <legend className={styles.group.label}>
                <FormattedMessage defaultMessage='Por categoría' id='7AAm0o' />
              </legend>
              <ul className='flex space-x-2'>
                {categories.map((category: CategoryType) =>
                  <li key={category.slug}>
                    <Category
                      size='normal'
                      category={category}
                      isSelected={selectedCategoriesSlugs.includes(category.slug)}
                      onClick={() => onCategoryToggle(category.slug)}
                    />
                  </li>
                )}
              </ul>
            </fieldset>
          ) : null}
          <div className='flex justify-end'>
            <Button
              onClick={onFilter}
              size={ButtonSize.sm}
              type={ButtonType.button}
              style={ButtonStyles.branded}
            >
              <FormattedMessage defaultMessage='Filtrar' id="VTfGzG" />
            </Button>
          </div>
        </div>
      ): null}
    </ReactControl>
  )
}

export default FilterControl
