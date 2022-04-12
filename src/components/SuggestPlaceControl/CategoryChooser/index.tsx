import { ReactNode } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import { FormattedMessage } from 'react-intl'

import Fieldset from '@maps/components/Fieldset'
import Marker, {
  Percentage,
  MarkerColor,
  MarkerSize
} from '@maps/components/Marker'
import Button, {
  Size as ButtonSize,
  Styles as ButtonStyles
} from '@maps/components/Button'
import { useMapData } from '@maps/components/CommunityProvider'
import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import type { Category } from '@maps/types/index'

type CategoryItemProps = {
  isSelected?: boolean
  category: Category
  right?: ReactNode
}
const CategoryItem = ({
  isSelected = false,
  category,
  right
}: CategoryItemProps) => {
  const styles = useStyles()
  return (
    <label
      htmlFor={category.slug}
      className={cn('flex items-center space-x-2 justify-between h-full', {
        'cursor-pointer flex-col rounded p-2 border border-transparent hover:border-gray-600 hover:shadow-sm ':
          !isSelected
      })}
    >
      <div className='flex items-center sm:h-full'>
        <div className='flex-none'>
          <Marker
            active
            isSelected
            withArrow={false}
            percentage={Percentage.full}
            color={category.iconColor || MarkerColor.brand}
            size={MarkerSize.normal}
            iconKey={category.iconKey}
            isFilter={false}
          />
        </div>
        <div className='flex-0 flex-col items-start flex sm:flex-col ml-2 relative'>
          {!isSelected ? (
            <input
              id={category.slug}
              type='radio'
              name='category'
              style={{ left: '-9999px' }}
              className='absolute'
            />
          ) : null}
          <div className={cn(styles.radio.label, 'font-medium')}>
            {category.name}
          </div>
          {!isSelected && category.description ? (
            <span className='text-xs text-gray-500'>
              {category.description}
            </span>
          ) : null}
        </div>
      </div>
      {right}
    </label>
  )
}

const CategoryChooser = ({ selectedCategory, setCategory }) => {
  const intl = useIntl()
  const { categories } = useMapData()
  const legend = intl.formatMessage({
    defaultMessage: 'Categoría',
    id: 'K6pXDZ'
  })

  if (categories.length === 1) return null

  const selected = categories.find(
    (c: Category) => c.slug === selectedCategory?.slug
  )
  return (
    <Fieldset legend={legend}>
      {selected ? (
        <CategoryItem
          category={selected}
          isSelected
          right={
            <Button
              outline
              style={ButtonStyles.secondary}
              size={ButtonSize.sm}
              onClick={() => setCategory(null)}
            >
              <FormattedMessage
                defaultMessage='Cambiar categoría'
                id='Wceeld'
              />
            </Button>
          }
        />
      ) : (
        <ul className='grid sm:grid-cols-2 gap-2'>
          {categories.map((category: Category, index: number) => (
            <li
              key={category.slug}
              className='cursor-pointer'
              onClick={() => setCategory(category)}
            >
              <CategoryItem category={category} />
              {index !== categories.length - 1 ? (
                <div className='h-px mb-1 w-full sm:hidden bg-gray-100' />
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Fieldset>
  )
}

export default CategoryChooser
