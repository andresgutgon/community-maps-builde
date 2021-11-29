import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { Control, ControlOptions, DomUtil, DomEvent,  Map as LeafletMap, Icon } from 'leaflet'
import 'leaflet.markercluster'
import { useMap, MapContainer, ZoomControl, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

import { CommunityProvider, useMapData } from '@maps/components/CommunityProvider'
import type { Category, MapAttribution, Marker as MarkerType } from '@maps/types/index'
import useTile from '@maps/components/CommunityProvider/useTile'
import ReactControl from '@maps/components/ReactControl/index'
import Search from '@maps/components/SearchControl'

import buildIcon from './buildIcon'
import buttomStyles from '@maps/components/Button/index.module.css'

/**
 * Set default Leaflet icon marker
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
  const { loading, config, places } = useMapData()
  const tile = useTile(config)
  const [map, setMap] = useState<LeafletMap>(null)
  const clusterRef = useRef<MarkerClusterGroup>(null)
  useEffect(() => {
    if (!map) return;

    map.fitBounds(clusterRef.current.getBounds());
  }, [map])


  if (loading) return null

  return (
    <MapContainer
      zoomControl={false}
      whenCreated={setMap}
      className='bg-gray-50 w-screen h-screen'
    >
      <ReactControl position='topleft'>
        <div className='shadow rounded bg-white p-3'>
          <Search locale={locale} />
        </div>
      </ReactControl>
      <ZoomControl position='topleft' />

      {/* The places. These are the markers of this map */}
      <MarkerClusterGroup
        ref={clusterRef}
        showCoverageOnHover={false}
        disableClusteringAtZoom={12}
        removeOutsideVisibleBounds={true}
      >
        {places.map(({ lat, long, name: title, categoryType }: MarkerType, index: number) => {
          const latLong = { lat: parseFloat(lat), lng: parseFloat(long) }
          const icon = buildIcon({ category: categoryType, dark: tile.dark })
          return (
            <Marker key={index} position={latLong} icon={icon}>
              <Popup>
                <div className='text-red-700'>
                  {`\`{ lat: '${lat}', long: '${long}', name: '${title}' }\``}
                </div>
              </Popup>
            </Marker>
          )
        })}
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
