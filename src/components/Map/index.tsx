import { useEffect, useState, useRef } from 'react'

import * as Leaflet from 'leaflet'
import 'leaflet.markercluster'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

// Styles from Leaflet and plugins
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { CommunityProvider, useMap } from '@maps/components/CommunityProvider'
import type { MapAttribution, Marker as MarkerType } from '@maps/types/index'
import useTile from '@maps/components/CommunityProvider/useTile'

// TODO: Custom icons
delete (Leaflet.Icon.Default.prototype as any)._getIconUrl
Leaflet.Icon.Default.mergeOptions({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png'
})

const MapWrapper = () => {
  const [map, setMap] = useState<Leaflet.Map>(null)
  const clusterRef = useRef<MarkerClusterGroup>(null)
  const { loading, config, markers } = useMap()
  const tile = useTile(config)
  useEffect(() => {
    if (!map) return;

    map.fitBounds(clusterRef.current.getBounds());
  }, [map])
  if (loading) return null

  return (
    <MapContainer
      whenCreated={setMap}
      className='bg-gray-50 w-screen h-screen'
    >
      <TileLayer {...tile} />
      <MarkerClusterGroup
        ref={clusterRef}
        showCoverageOnHover={false}
        disableClusteringAtZoom={12}
        removeOutsideVisibleBounds={true}
      >
        {markers.map(({ lat, long, name: title }: MarkerType, index: number) => {
          const latLong = { lat: parseFloat(lat), lng: parseFloat(long) }
          // Extend LatLngBounds with coordinates
          // bounds.extend(latLong)
          return (
            <Marker key={index} position={latLong}>
              <Popup>
                {`\`{ lat: '\$\{lat\}', long: '\$\{long\}\', name: '\$\{title\}' }\``}
              </Popup>
            </Marker>
          )
        })}
      </MarkerClusterGroup>
    </MapContainer>
  )
}

type Props = {
  community: string,
  mapId: string
}
const Map = ({ community, mapId }: Props) => {
  return (
    <CommunityProvider community={community} mapId={mapId}>
      <MapWrapper />
    </CommunityProvider>
  )
}

export default Map
