import { useState, useRef } from 'react'
import { renderToString } from 'react-dom/server'

import { Category, CategoryIcon } from '@maps/types/index'
import Marker, {
  Props,
  MarkerColor,
  MarkerSize,
  Percentage
} from '@maps/components/Marker'

export const buildMarkerStringType = (
  iconKey: CategoryIcon,
  iconColor: MarkerColor,
  percentage: Percentage,
  active: boolean
): string =>
  `${iconKey}_${iconColor}_${percentage}_${active ? 'active' : 'inactive'}`

export type MarkersAsString = Record<string, string>
export type MarkerPropsItem = Pick<
  Props,
  'iconKey' | 'color' | 'percentage' | 'active'
>
type MarkerProps = MarkerPropsItem[]
export type BuildMarkerFn = (
  categories: Category[],
  showPercentage: boolean
) => void
type ReturnType = {
  buildIconMarkers: BuildMarkerFn
  iconMarkers: MarkersAsString
}
/**
 * Icons in Leaflet are pased as strings. Even using React.
 * This hook pre-compile all the icons necessary for this map based on
 * their categories
 */
const useMarkersAsString = (): ReturnType => {
  const percentages = useRef<Percentage[]>(Object.values(Percentage)).current
  const [iconMarkers, setIconMarkers] = useState<MarkersAsString | null>(null)
  const buildIconMarkers = (
    categories: Category[],
    showPercentage: boolean
  ) => {
    // Avoid recomputing if iconMarkers is not null
    if (iconMarkers) return iconMarkers

    const icons = categories
      .reduce((memo: MarkerProps[], { iconKey, iconColor }: Category) => {
        const color = iconColor || MarkerColor.brand
        const activePercentages = showPercentage
          ? percentages
          : [Percentage.full]
        return [
          ...memo,
          ...activePercentages.map((percentage: Percentage) => ({
            iconKey,
            color,
            percentage,
            active: true
          })),
          ...activePercentages.map((percentage: Percentage) => ({
            iconKey,
            color,
            percentage,
            active: false
          }))
        ]
      }, [])
      .reduce(
        (
          memo: MarkersAsString,
          { percentage, iconKey, color, active }: Props
        ) => {
          const html = renderToString(
            <Marker
              active={active}
              isSelected
              withArrow
              iconKey={iconKey}
              color={color}
              percentage={percentage}
              size={MarkerSize.normal}
              isFilter={false}
            />
          )
          memo[buildMarkerStringType(iconKey, color, percentage, active)] = html
          return memo
        },
        {}
      )
    setIconMarkers(icons)
  }

  return { buildIconMarkers, iconMarkers }
}

export default useMarkersAsString
