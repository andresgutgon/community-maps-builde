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
  percentage: Percentage
): string => `${iconKey}_${iconColor}_${percentage}`

export type MarkersAsString = Record<string, string>
type MarkerProps = Pick<Props, 'iconKey' | 'color' | 'percentage'>[]
type ReturnType = {
  buildIconMarkers: (categories: Category[]) => void
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
  const buildIconMarkers = (categories: Category[]) => {
    // Avoid recomputing if iconMarkers is not null
    if (iconMarkers) return iconMarkers

    const icons = categories
      .reduce((memo: MarkerProps[], { iconKey, iconColor }: Category) => {
        const color = iconColor || MarkerColor.brand
        return [
          ...memo,
          ...percentages.map((percentage: Percentage) => ({
            iconKey,
            color,
            percentage
          }))
        ]
      }, [])
      .reduce(
        (memo: MarkersAsString, { percentage, iconKey, color }: Props) => {
          const html = renderToString(
            <Marker
              isSelected
              withArrow
              iconKey={iconKey}
              color={color}
              percentage={percentage}
              size={MarkerSize.normal}
            />
          )
          memo[buildMarkerStringType(iconKey, color, percentage)] = html
          return memo
        },
        {}
      )
    setIconMarkers(icons)
  }

  return { buildIconMarkers, iconMarkers }
}

export default useMarkersAsString
