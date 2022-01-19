import { useMemo } from 'react'
import { DivIcon, divIcon } from 'leaflet'

import { useMapData } from '@maps/components/CommunityProvider'
import { Percentage } from '@maps/components/Marker'
import { buildMarkerStringType } from '@maps/components/Marker/useMarkersAsString'

type Props = { slug: string; percentage: Percentage }
const useMarkerIcon = ({ percentage, slug }: Props): DivIcon | null => {
  const { iconMarkers, config } = useMapData()
  return useMemo<DivIcon | null>(() => {
    const iconConfig = config.categories[slug]
    if (!iconConfig) return null
    const { iconKey, iconColor } = iconConfig
    return divIcon({
      className: null,
      html: iconMarkers[buildMarkerStringType(iconKey, iconColor, percentage)],
      iconSize:    [40, 40],
      iconAnchor:  [19, 46],
      popupAnchor: [2, -50],
      tooltipAnchor: [2, -40],
    })
  }
  , [iconMarkers, slug, config, percentage])
}

export default useMarkerIcon
