import { useEffect, useState, useRef } from 'react'
import cn from 'classnames'

import * as Leaflet from 'leaflet'
import 'leaflet.markercluster'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'

// Styles from Leaflet and plugins
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { CommunityProvider, useMap } from '@maps/components/CommunityProvider'
import type { Category, MapAttribution, Marker as MarkerType } from '@maps/types/index'
import useTile from '@maps/components/CommunityProvider/useTile'
import { ICONS } from '@maps/lib/icons'

delete (Leaflet.Icon.Default.prototype as any)._getIconUrl
Leaflet.Icon.Default.mergeOptions({
    iconUrl: '/marker-icon.png',
    iconRetinaUrl: '/marker-icon-2x.png',
    shadowUrl: '/marker-shadow.png'
})

type BuildIconProps = { category: Category, dark: boolean }
function buildIcon ({ category, dark }: BuildIconProps): Leaflet.DivIcon {
  const icon = ICONS[category] || ICONS[ICONS.car]
  return Leaflet.divIcon({
    className: null,
    html: `
      <div
        class="${
          cn(
            'h-10 w-10 relative rounded shadow-xl',
            {
              'bg-gray-900': !dark,
              'border border-gray-900 bg-gray-200': dark,
            }
        )}"
        >
        <div
          class="${
            cn(
              'rounded absolute inset-0 z-10 flex items-center justify-center',
              {
                'bg-gray-900': !dark,
                'bg-gray-200': dark,
              }
          )}"
          >
          <i class="${
            cn(
              'fas text-base',
              icon,
              {
                'text-white ': !dark,
                'text-gray-800 ': dark,
              }
            )}"
          ></i>
        </div>
        <div class='pointer-events-none h-2 w-10 -bottom-2 absolute flex justify-center'>
          <div class="${
            cn(
              '-mt-2 p-1 w-3 h-3 rounded-sm shadow-xl transform rotate-45',
              {
                'bg-gray-900 ': !dark,
                'border border-gray-900 bg-gray-200': dark,
              }
            )}"
          ></div>
        </div>
      </div>
    `,
    iconSize:    [40, 40],
    iconAnchor:  [19, 46],
    popupAnchor: [2, -50],
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

  return (
    <MapContainer whenCreated={setMap} className='bg-gray-50 w-screen h-screen'>
      <TileLayer {...tile} />
      <MarkerClusterGroup
        ref={clusterRef}
        showCoverageOnHover={false}
        disableClusteringAtZoom={12}
        removeOutsideVisibleBounds={true}
      >
        {markers.map(({ lat, long, name: title, categoryType }: MarkerType, index: number) => {
          const latLong = { lat: parseFloat(lat), lng: parseFloat(long) }
          const icon = buildIcon({ category: categoryType, dark: tile.dark })
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
