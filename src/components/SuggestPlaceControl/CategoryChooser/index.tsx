import { Dispatch, SetStateAction } from 'react'
import { ReactNode } from 'react'
import cn from 'classnames'
import { FormattedMessage } from 'react-intl'

import Marker, { Percentage, MarkerColor, MarkerSize }from '@maps/components/Marker'
import Button, { Size as ButtonSize, Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import { useMapData } from '@maps/components/CommunityProvider'
import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import type { Category } from '@maps/types/index'

type CategoryItemProps = {
  isSelected?: boolean,
  category: Category,
  right?: ReactNode
}
const CategoryItem = ({ isSelected = false, category, right }: CategoryItemProps) => {
  const styles = useStyles()
  return (
    <div className={cn('flex items-center space-x-2 justify-between p-2 border border-transparent h-full hover:border-gray-600 hover:shadow-sm rounded', { 'shadow-sm border-gray-600': isSelected })}>
      <div className='flex items-center'>
        <div className='flex-none'>
          <Marker
            isSelected
            withArrow={false}
            percentage={Percentage.full}
            color={category.iconColor || MarkerColor.brand}
            size={MarkerSize.normal}
            iconKey={category.iconKey}
          />
        </div>
        <div className='flex-0 flex-col items-start flex sm:flex-col ml-2'>
          <div className={cn(styles.radio.label, 'font-medium')}>
            {category.name}
          </div>
          {(!isSelected && category.description) ? (
            <span className='text-xs text-gray-500'>
              {category.description}
            </span>
          ) : null}
        </div>
      </div>
      {right}
    </div>
  )
}

type Props = {
  selectedCategory: Category | null
  setCategory: Dispatch<SetStateAction<null | Category>>
}
const CategoryChooser = ({ selectedCategory, setCategory }) => {
  const { categories } = useMapData()
  if (categories.length === 1) return null

  const selected = categories.find((c: Category) => c.slug === selectedCategory?.slug)
  if (selected) {
    return (
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
            <FormattedMessage defaultMessage='Cambiar categoría' id="Wceeld" />
          </Button>
        }
      />
    )
  }

  return (
    <ul className='grid sm:grid-cols-2 gap-2'>
      {categories.map((category: Category) =>
        <li key={category.slug} className='cursor-pointer' onClick={() => setCategory(category)}>
          <CategoryItem category={category} />
        </li>
      )}
    </ul>
  )
}

export default CategoryChooser
