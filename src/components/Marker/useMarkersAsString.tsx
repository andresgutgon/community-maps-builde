import { useState, useRef } from 'react'
import { renderToString } from 'react-dom/server'

import { Category, CategoryIcon } from '@maps/types/index'
import { FinancingState } from '@maps/components/FilterControl/useFilters'
import Marker, { MarkerGenericType, Props as MarkerProps, MarkerType, MarkerSize } from '@maps/components/Marker'

export const buildMarkerStringType = (iconKey: CategoryIcon, type: MarkerType): string => `${iconKey}_${type}`
export type MarkersAsString = Record<string, string>
type Props  = Pick<MarkerProps, 'iconKey' | 'type'>[]
type ReturnType = {
  buildIconMarkers: (categories: Category[]) => void,
  iconMarkers: MarkersAsString
}
const useMarkersAsString = (): ReturnType => {
  const markerTypes = useRef<MarkerType[]>(
    [
      ...Object.values(FinancingState).filter(state => state !== FinancingState.anyFinancingState),
      MarkerGenericType.active
    ]
  ).current
  const [iconMarkers, setIconMarkers] = useState<MarkersAsString | null>(null)
  const buildIconMarkers = (categories: Category[]) => {
    const markers = categories.reduce((memo: MarkerType[], { iconKey }: Category) => {
      return [
        ...memo,
        ...markerTypes.map((type: MarkerType) => ({ type, iconKey }))
      ]
    }, [])
    const icons = markers.reduce((memo: MarkersAsString, { iconKey, size, type, isSelected, withArrow }: MarkerProps) => {
      const html = renderToString(
        <Marker
          isSelected
          withArrow
          size={MarkerSize.normal}
          iconKey={iconKey}
          type={type}
        />
      )
      memo[buildMarkerStringType(iconKey, type)] = html
      return memo
    }, {})
    setIconMarkers(icons)
  }

  return { buildIconMarkers, iconMarkers }
}

export default  useMarkersAsString
