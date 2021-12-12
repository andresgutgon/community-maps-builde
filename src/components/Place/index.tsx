import { ReactElement, useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Popup as LeafletPopup } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'

import { useMapData } from '@maps/components/CommunityProvider'
import type { Place as PlaceType } from '@maps/types/index'
import buildIcon from './buildIcon'

type Props = { place: PlaceType; openPlaceFn: () => void }
const FakeContent = (props: Props) => <div>Loding...</div>
export default function Place (props: Props) {
  const popupRef = useRef()
  const { openPlaceFn, place } = props
  const [loading, setLoading] = useState(false)
  const [loaded, setLoadComponent] = useState(false)
  const [Content, setContent] = useState<ReactElement<Props>>(
    <FakeContent {...props} />
  )
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
    if (loaded) return
    async function loadComponent () {
      setLoading(true)
      const Component = await dynamic(() => import('./PopupContent'))
      setContent(<Component place={place} openPlaceFn={openPlaceFn} />)
      setLoadComponent(true)
      setLoading(false)
    }
    loadComponent()
  }, [openPlaceFn, place, loaded])
  return (
    <Marker position={latLng} icon={icon}>
      <Popup ref={popupRef} onOpen={() => {
        if (loaded) return
        setLoading(true)
      }}>
        {Content}
      </Popup>
    </Marker>
  )
}
