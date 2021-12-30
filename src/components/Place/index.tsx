import { useRef } from 'react'
import { Marker } from 'react-leaflet'
import { divIcon } from 'leaflet'
import type { LeafletEventHandlerFnMap } from 'leaflet'

import { useFindFinantialStateByRange } from '@maps/components/FilterControl/useFilters'
import { MarkerGenericType } from '@maps/components/Marker'
import { useMapData } from '@maps/components/CommunityProvider'
import type { Place as PlaceType } from '@maps/types/index'
import { buildMarkerStringType } from '@maps/components/Marker/useMarkersAsString'

type Props = {
  place: PlaceType
  onClick: (place: PlaceType) => void,
  onClosePopup: () => void,
  isOpenPlace: boolean
}
export default function Place ({ isOpenPlace, onClosePopup, place, onClick }: Props) {
  const { iconMarkers, config } = useMapData()
  const { name, active, lat, lng, goalProgress } = place
  const financialState = useFindFinantialStateByRange(goalProgress)
  const type = active ? MarkerGenericType.active : financialState
  const { iconKey } = config.categories[place.category_slug]
  const icon = useRef(
    divIcon({
      className: null,
      html: iconMarkers[buildMarkerStringType(iconKey, type)],
      iconSize:    [40, 40],
      iconAnchor:  [19, 46],
      popupAnchor: [2, -50],
      tooltipAnchor: [2, -40],
    })
  ).current
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
