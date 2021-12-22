import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { Control, ControlOptions, DomUtil, DomEvent,  Map as LeafletMap, Icon } from 'leaflet'
import 'leaflet.markercluster'
import { useMap, MapContainer, ZoomControl, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import { CommunityProvider, useMapData } from '@maps/components/CommunityProvider'
import type { Category, MapAttribution, Place as PlaceType } from '@maps/types/index'
import useTile from '@maps/components/CommunityProvider/useTile'
import Search from '@maps/components/SearchControl'
import Filter from '@maps/components/FilterControl'
import Place from '@maps/components/Place'

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
      map.setView({ lat: 413874, lng: 21686 }, 16)
    }
  }, [mapLoaded, map, places, currentPlace])
  return (
    <MapContainer
      zoomControl={false}
      whenCreated={setMap}
      className='z-40 bg-gray-50 w-screen h-screen'
    >
      <Search locale={locale} />
      <Filter />
      <ZoomControl position='topleft' />

      {/* The places. These are the places of this map */}
      <MarkerClusterGroup
        ref={clusterRef}
        showCoverageOnHover={false}
        disableClusteringAtZoom={12}
        removeOutsideVisibleBounds={true}
      >
        {places.map((place: PlaceType, index: number) =>
          <Place
            key={index}
            map={map}
            place={place}
            isCurrent={currentPlace?.slug === place.slug}
          />
        )}
      </MarkerClusterGroup>

      {/* The tiles and the attribution in the map*/}
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
