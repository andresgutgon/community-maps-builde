import { ReactElement, useRef, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import dynamic from 'next/dynamic'
import { Map, Popup as LeafletPopup } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'

import { useMapData } from '@maps/components/CommunityProvider'
import type { Place as PlaceType } from '@maps/types/index'
import buildIcon from './buildIcon'

export const Loading = () =>
  <div className='p-10 flex items-center justify-center h-28'>
    <FormattedMessage defaultMessage='Cargando' id='m9eXO9' />{'...'}
  </div>

type Props = {
  isCurrent: boolean,
  map: null | Map,
  place: PlaceType
}
export default function Place ({ map, isCurrent, place }: Props) {
  const { config, resetPlaces } = useMapData()
  const popupRef = useRef<LeafletPopup | null>(null)
  const [loading, setLoading] = useState(false)
  const [Content, setContent] = useState(null)
  const { name, lat, lng } = place
  const category = config.categories[place.category_slug]
  const icon = buildIcon({ category, animate: loading })
  const latLng = useRef({ lat: parseFloat(lat), lng: parseFloat(lng) }).current

  useEffect(() => {
    if (!isCurrent) return
    setLoading(true)
  }, [setLoading, isCurrent])
  // Lazyload with "dynamic" import the JS for ./PopupContent.tsx
  useEffect(() => {
    if (Content) return

    async function loadComponent () {
      const Component = await dynamic(
        () => import('./PopupContent'),
        { loading: () => <Loading /> }
      )
      setContent(Component)
      setLoading(false)
      const popup = popupRef.current
      if (map && popup && isCurrent) {
        popup.setLatLng(latLng)
        popup.openOn(map)
      }
    }
    loadComponent()
  }, [isCurrent, latLng, map, popupRef, Content, loading])
  return (
    <Marker position={latLng} icon={icon}>
      <Popup
        ref={popupRef}
        position={latLng}
        className={place.category_slug ? 'leaflet-popup--with-action' : ''}
        closeButton={false}
        maxWidth={500}
        onOpen={() => {
          if (Content) return
          setLoading(true)
        }}
        onClose={resetPlaces}
      >
        {Content ? <Content place={place} /> : null}
      </Popup>
    </Marker>
  )
}
