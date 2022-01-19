import { useEffect, ChangeEvent, useRef, useState } from 'react'

import config from '@maps/data/config'
import { CategoryIcon } from '@maps/types/index'
import { ICONS } from '@maps/lib/icons'
import Marker, {
  Percentage,
  MarkerColor,
  MarkerSize,
} from '@maps/components/Marker'

type HeaderProps = { title: string }
const Header = ({ title }: HeaderProps) => (
  <h2 className='font-medium text-2xl mb-2'>{title}</h2>
)

const Markers = () => {
  useEffect(() => {
    const styleTag = document.createElement('style')
    styleTag.setAttribute('id', 'theme-brand-colors')
    document.head.appendChild(styleTag)
    styleTag.innerHTML = `
      :root {
        --color-text-base: ${config.theme.color.textColorBase};
        --color-fill: ${config.theme.color.fillColor};
        --color-border: ${config.theme.color.borderColor};
        --color-button: ${config.theme.color.buttonColor};
        --color-button-hover: ${config.theme.color.buttonColorHover};
        --color-text-button: ${config.theme.color.buttonTextColor};
        --color-text-button-hover: ${config.theme.color.buttonTextColorHover};
        --color-text-inverted-button: ${config.theme.color.buttonTextInvertedColor};
        --color-text-inverted-button-hover: ${config.theme.color.buttonTextInvertedColorHover};
    `
  }, [])
  const colors = useRef<MarkerColor[]>(Object.values(MarkerColor)).current
  const [size, setSize] = useState<MarkerSize>(MarkerSize.normal)
  const [percentage, setPercentage] = useState<Percentage>(Percentage.full)
  return (
    <div className='container p-4'>
      <main className='space-y-4'>
        <div className='text-center pb-3 border-b border-gray-100'>
          <h1 className='text-xl font-medium'>Markers</h1>
          <p>All the markers with styles you can use in the map</p>
        </div>
        <div className='flex flex-row space-x-3'>
          <select
            name='type'
            value={size}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setSize(event.target.value as MarkerSize)
            }
          >
            {Object.values(MarkerSize).map((size: MarkerSize) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <select
            name='percentage'
            value={percentage}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setPercentage(event.target.value as Percentage)
            }
          >
            {Object.values(Percentage).map((percentage: Percentage) => (
              <option key={percentage} value={percentage}>
                {percentage}
              </option>
            ))}
          </select>
        </div>
        <section>
          <Header title='Colors' />
          <ul className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3'>
            {colors.map((color: MarkerColor) => {
              return (
                <li
                  key={color}
                  className='rounded flex flex-col space-y-2 items-center justify-center border border-gray-100 p-4 sm:p-12'
                >
                  <Marker
                    isSelected
                    withArrow
                    percentage={percentage}
                    color={color}
                    size={size}
                    iconKey={CategoryIcon.car}
                  />
                  <div className='text-center text-gray-400 text-sm'>
                    {color}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
        <section>
          <Header title='Icons' />
          <ul className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3'>
            {Object.keys(ICONS).map((key: CategoryIcon, index: number) => {
              const isSelected = index !== 0
              return (
                <li
                  key={key}
                  className='rounded flex flex-col space-y-2 items-center justify-center border border-gray-100 p-4 sm:p-12'
                >
                  <Marker
                    withArrow
                    percentage={Percentage.full}
                    color={MarkerColor.brand}
                    size={size}
                    iconKey={key}
                    isSelected={isSelected}
                  />
                  <div className='text-center text-gray-400 text-sm'>
                    {key}&nbsp;
                    {!isSelected ? '(disabled)' : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </main>
    </div>
  )
}

export default Markers
