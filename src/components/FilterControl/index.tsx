import { useRef, useState } from 'react'
import cn from 'classnames'
import { useIntl, FormattedMessage } from 'react-intl'

import ReactControl from '@maps/components/ReactControl/index'
import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import { useMapData } from '@maps/components/CommunityProvider'
import type { Category as CategoryType } from '@maps/types/index'
import { ICONS } from '@maps/lib/icons'
import { ICON_COLORS } from '@maps/components/Place/buildIcon'
import Slider, { Color } from '@maps/components/Slider'
import Button, { Size as ButtonSize, Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'

enum ActiveState { all = 'all', active = 'active', inactive = 'inactive' }
type CategoryProps = {
  category: CategoryType,
  isSelected: boolean,
  onClick: () => void
}
const Category = ({ onClick, category, isSelected }: CategoryProps) => {
  const icon = ICONS[category.iconKey] || ICONS[ICONS.car]
  const color = ICON_COLORS[category.iconColor]
  return (
    <button
       onClick={onClick}
        className={
          cn(
            'h-10 w-10 relative rounded-full shadow-md border',
            color.bg,
            color.border
          )
        }
      >
      <div className='rounded-full absolute inset-0 z-10 flex items-center justify-center ${color.bg} border border-white border-opacity-75'>
        <i className={cn('fas text-base text-opacity-90', color.icon, icon)} />
      </div>
    </button>
  )
}

const FilterControl = () => {
  const intl = useIntl()
  const { config } = useMapData()
  const categories = useRef<CategoryType[]>(Object.keys(config.categories).map((key: string) =>
    config.categories[key]
  )).current
  const styles = useStyles()
  const [open, setOpen] = useState(false)
  const defaultContributionPercentage = useRef(30).current

  // Initial Filter states
  // TODO: Pick from URL
  const [selectedCategories, setSelected] = useState<string[]>([])
  const [checkedState, setCheckedState] = useState<ActiveState>(ActiveState.all)
  const [usingPercentage, setUsingPercentage] = useState<boolean>(false)
  const [contributionPercentage, setPercentage] = useState<number>(defaultContributionPercentage)

  const onClickIcon = () => { setOpen(!open) }
  const states = useRef<ActiveState[]>([ActiveState.all, ActiveState.active, ActiveState.inactive]).current
  const stateLabels = useRef<Record<ActiveState, string>>({
    [ActiveState.all]: intl.formatMessage({ defaultMessage: 'Todos', id: 'P8VfZA' }),
    [ActiveState.active]: intl.formatMessage({ defaultMessage: 'Activos', id: 'GbLpqH' }),
    [ActiveState.inactive]: intl.formatMessage({ defaultMessage: 'Inactivos', id: 'ZNZWBc' })
  }).current
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
      <button onClick={onClickIcon} className='flex flex-row items-center space-x-1'>
        <div className='fas fa-filter' />
        <span className={cn('font-medium', { 'text-lg': open })}>
          <FormattedMessage defaultMessage='Filtrar lugares' id='4kF+sS' />
        </span>
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
                      checked={checkedState === state}
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
                      <strong className='text-gray-900 font-medium'>
                        ({contributionPercentage}%)
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
                      category={category}
                      isSelected={selectedCategories.includes(category.slug)}
                      onClick={() => {}}
                    />
                  </li>
                )}
              </ul>
            </fieldset>
          ) : null}
          <div className='flex justify-end'>
            <Button
              onClick={() => {}}
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
