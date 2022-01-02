import { useRef, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import { FormattedMessage } from 'react-intl'
import dynamic from 'next/dynamic'
import { Map, Popup as LeafletPopup } from 'leaflet'
import { Popup } from 'react-leaflet'

import { useMapData } from '@maps/components/CommunityProvider'
import type { Place as PlaceType } from '@maps/types/index'

export const Loading = () =>
  <div className='p-10 flex items-center justify-center h-28'>
    <FormattedMessage defaultMessage='Cargando' id='m9eXO9' />{'...'}
  </div>

const MOBILE_WIDTH = 768

/**
 * This handle hide the controls when a popup is shown in mobile
 * On mobile the controls overlaps with the popup and is annoying
 */
type UseMobileControlsVisibilityReturnType = { onOpenPopup: () => void; onClosePopup : () => void }
const useMobileControlsVisibility = (): UseMobileControlsVisibilityReturnType => {
  const { controlCssTag } = useMapData()
  const windowWidth = useRef(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth).current
  const isMobile = useRef<boolean>(windowWidth <= MOBILE_WIDTH).current
  return {
    onOpenPopup: () => {
      if (!isMobile) return

      controlCssTag.innerHTML = `
        div.leaflet-top { opacity: 0; }
        div.leaflet-top * { pointer-events: none; }
      `
    },
    onClosePopup: () => {
      if (!isMobile) return

      controlCssTag.innerHTML = `
        div.leaflet-top { opacity: 1; }
        div.leaflet-top * { pointer-events: auto; }
      `
    }
  }
}

type Props = {
  onClose: () => void
  place: PlaceType
}
export default function PlacePopup ({ onClose, place }: Props) {
  const { onOpenPopup, onClosePopup } = useMobileControlsVisibility()
  const { config } = useMapData()
  const [Content, setContent] = useState(null)
  const latLng = useMemo(() => ({
    lat: parseFloat(place?.lat || '0'), lng: parseFloat(place?.lng || '0')
  }), [place])
  // Lazyload with "dynamic" import the JS for ./PopupContent.tsx
  useEffect(() => {
    if (Content) return

    async function loadComponent () {
      const Component = await dynamic(
        () => import('./PopupContent'),
        { loading: () => <Loading /> }
      )

      setContent(Component)
    }
    loadComponent()
  }, [Content])
  return (
    <Popup
      className={cn({ 'leaflet-popup--with-action': !!place?.form_slug })}
      closeButton={false}
      position={latLng}
      maxWidth={500}
      onOpen={onOpenPopup}
      onClose={() => {
        onClosePopup()
        onClose()
      }}
    >
      {Content ? <Content place={place} /> : null}
    </Popup>
  )
}
