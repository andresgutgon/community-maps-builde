import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { Control, ControlOptions, DomUtil, DomEvent,  Map as LeafletMap, Icon } from 'leaflet'
import 'leaflet.markercluster'
import { useMapEvents, useMap, MapContainer, ZoomControl, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import { CommunityProvider, useMapData } from '@maps/components/CommunityProvider'
import type { Category, MapAttribution, Place as PlaceType } from '@maps/types/index'
import useTile from '@maps/components/CommunityProvider/useTile'
import Search from '@maps/components/SearchControl'
import Fullscreen from '@maps/components/FullscreenControl'
import Filter from '@maps/components/FilterControl'
import Place from '@maps/components/Place'
import PlacePopup from '@maps/components/PlacePopup'

/**
 * Set default Leaflet icon place
 * Not used but is the way to let Leaflet know where
 * are these images in this project
 */
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png'
})

const MapWrapper = () => {
  const { locale } = useRouter();
  const { currentPlace, config, places } = useMapData()
  const tile = useTile(config)
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)
  const [map, setMap] = useState<LeafletMap>(null)
  const clusterRef = useRef<MarkerClusterGroup>(null)
  const [openPlace, setOpenPlace] = useState<PlaceType | null>(currentPlace)
  useEffect(() => {
    if (!currentPlace) return
    setOpenPlace(currentPlace)
  }, [currentPlace])
  useEffect(() => {
    if (!map || mapLoaded) return;

    if (currentPlace) {
      map.setView(
        { lat: +currentPlace.lat, lng: +currentPlace.lng },
        16 // initial zoom
      )
      setMapLoaded(true)
    } else if (places.length > 0) {
      map.fitBounds(clusterRef.current.getBounds());
      setMapLoaded(true)
    } else {
      // While loading places set center in Barcelona
      // This could be a config so community could set their default center
      map.setView({
        lat: 41.385947, lng: 2.170495
      }, 10)
    }
  }, [mapLoaded, map, places, currentPlace])
  const onClickPlace = (place: PlaceType) => {
    setOpenPlace(openPlace?.slug === place.name ? null : place)
  }
  const onClosePopup = () => { setOpenPlace(null) }
  {/*
    Document what these options are:

    @fadeAnimation: disabled to avoid showing empty popup wrapper when place
    info is closed.
    @tap: Set to false to avoid double click on mobile browsers.
    @zoomControl: We set the control manually with the <ZoomControl /> component
    @whenCreated: we set map instance as a local state here to get access to it and to center map.

  */}
  return (
    <MapContainer
      fadeAnimation={false}
      tap={false}
      zoomControl={false}
      whenCreated={setMap}
      className='z-40 bg-gray-50 w-screen h-screen'
    >
      {/* Map's controls */}
      <Search locale={locale} />
      <Filter />
      <Fullscreen />
      <ZoomControl position='topleft' />

      {/* The places. These are the places in the map */}
      <MarkerClusterGroup
        ref={clusterRef}
        showCoverageOnHover={false}
        disableClusteringAtZoom={12}
        removeOutsideVisibleBounds={true}
      >
        {places.map((place: PlaceType, index: number) =>
          <Place
            key={place.slug}
            place={place}
            isOpenPlace={place.slug === openPlace?.slug}
            onClick={onClickPlace}
            onClosePopup={onClosePopup}
          />
        )}
      </MarkerClusterGroup>

      {/* Place detail popup */}
      {openPlace ? (
        <PlacePopup place={openPlace} onClose={onClosePopup} />
      ) : null}

      {/* The tiles and the attribution in the map */}
      <TileLayer {...tile} />
    </MapContainer>
  )
}

type Props = { community: string, mapId: string }
const Map = ({ community, mapId }: Props) => {
  return (
    <CommunityProvider community={community} mapId={mapId}>
      <MapWrapper />
    </CommunityProvider>
  )
}

export default Map
