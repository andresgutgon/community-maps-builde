import { useRef } from 'react'
import { Marker } from 'react-leaflet'
import { divIcon } from 'leaflet'
import type { LeafletEventHandlerFnMap } from 'leaflet'

import { MarkerColor } from '@maps/components/Marker'
import type { Place as PlaceType } from '@maps/types/index'
import { useMarkerPercentage, Percentage } from '@maps/components/Marker'
import { buildMarkerStringType } from '@maps/components/Marker/useMarkersAsString'
import useMarkerIcon from '@maps/hooks/useMarkerIcon'

type Props = {
  place: PlaceType
  onClick: (place: PlaceType) => void,
  onClosePopup: () => void,
  isOpenPlace: boolean
}
export default function Place ({ isOpenPlace, onClosePopup, place, onClick }: Props) {
  const { name, lat, lng, active, goalProgress } = place
  const realPercentage = useMarkerPercentage(goalProgress)
  const percentage = active ? Percentage.full : realPercentage
  const icon = useMarkerIcon({ percentage, slug: place.category_slug })
  const latLng = useRef({ lat: parseFloat(lat), lng: parseFloat(lng) }).current
  let eventHandlers: LeafletEventHandlerFnMap = { click: () => {
    onClick(place)
  }}
  if (isOpenPlace) {
    eventHandlers = {...eventHandlers, remove: onClosePopup }
  }
  return (
    <Marker
      icon={icon}
      position={latLng}
      eventHandlers={eventHandlers}
    />
  )
}
