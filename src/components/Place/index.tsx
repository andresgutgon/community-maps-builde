import { ReactElement, useRef, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import dynamic from 'next/dynamic'
import { Popup as LeafletPopup } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'

import { useMapData } from '@maps/components/CommunityProvider'
import type { Place as PlaceType } from '@maps/types/index'
import buildIcon from './buildIcon'

const Loading = () =>
  <div className='p-10 flex items-center justify-center h-28'>
    <FormattedMessage defaultMessage='Cargando' id='m9eXO9' />{'...'}
  </div>

type Props = { place: PlaceType }
export default function Place ({ place }: Props) {
  const popupRef = useRef()
  const [loading, setLoading] = useState(false)
  const [Content, setContent] = useState(null)
  const { config } = useMapData()
  const { name, lat, lng } = place
  const category = config.categories[place.category_slug]

  // Setup icon based on category
  const icon = buildIcon({ category, animate: loading })
  const latLng = { lat: parseFloat(lat), lng: parseFloat(lng) }

  // Configure LeafletPopup used under the hood
  useEffect(() => {
    const popup = popupRef.current
    if (!popup) return
    const options = (popup as LeafletPopup).options
    options.maxWidth = 500;
    options.closeButton = false
  }, [])

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
    }
    loadComponent()
  }, [Content, loading])
  return (
    <Marker position={latLng} icon={icon}>
      <Popup ref={popupRef} onOpen={() => {
        if (Content) return
        setLoading(true)
      }}>
        {Content ? (
          <Content place={place} />
        ) : null}
      </Popup>
    </Marker>
  )
}
