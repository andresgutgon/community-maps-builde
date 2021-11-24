import { useEffect, useState, useRef } from 'react'
import { renderToString } from 'react-dom/server'

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
import { Icon, ICONS } from '@maps/components/Icon'

function buildIcon (progress: number, icon: string): Leaflet.DivIcon {
  const iconSvg = ICONS[icon] || ICONS[ICONS.car]
  return Leaflet.divIcon({
    className: 'custom-icon',
    html: renderToString(<Icon progress={progress} icon={iconSvg} />),
    iconSize:    [32, 32],
    iconAnchor:  [16, 40],
    popupAnchor: [2, -42],
    tooltipAnchor: [2, -40],
  })
}
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

  const oneMarker = [
    { custom: true, goalProgress: 67, lat: '42.702294', long: '0.793881', name: 'Som Mobilitat - Vielha' },
    { custom: false, goalProgress: 67, lat: '42.702294', long: '0.793881', name: 'Som Mobilitat - Vielha' },
  ]
  const points = oneMarker
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
        {markers.map(({ lat, long, name: title, goalProgress, categoryType }: MarkerType, index: number) => {
          const latLong = { lat: parseFloat(lat), lng: parseFloat(long) }
          const icon = buildIcon(goalProgress, categoryType)
          return (
            <Marker key={index} position={latLong} icon={icon}>
              <Popup>
                {`\`{ lat: '${lat}', long: '${long}', name: '${title}' }\``}
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
