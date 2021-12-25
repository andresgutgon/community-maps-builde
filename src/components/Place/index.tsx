import { useRef } from 'react'
import { Marker } from 'react-leaflet'
import type { LeafletEventHandlerFnMap } from 'leaflet'

import { useMapData } from '@maps/components/CommunityProvider'
import type { Place as PlaceType } from '@maps/types/index'
import buildIcon from './buildIcon'

type Props = {
  place: PlaceType
  onClick: (place: PlaceType) => void,
  onClosePopup: () => void,
  isOpenPlace: boolean
}
export default function Place ({ isOpenPlace, onClosePopup, place, onClick }: Props) {
  const { config } = useMapData()
  const { name, lat, lng } = place
  const category = config.categories[place.category_slug]
  const icon = buildIcon({ category, animate: false })
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
