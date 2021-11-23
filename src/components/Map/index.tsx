import 'leaflet/dist/leaflet.css';

import * as L from 'leaflet'
import Script from 'next/script'

import { CommunityProvider, useMap } from '@maps/components/CommunityProvider'
import type { MapAttribution, Marker } from '@maps/types/index'
import useTile from '@maps/components/CommunityProvider/useTile'


window.L = L

const MapWrapper = () => {
  const { loading, config, markers } = useMap()
  const tile = useTile(config)

  if (loading) return null

  return (
    <Script
      id='getStarted'
      dangerouslySetInnerHTML={{
        __html: `
          var center = [41.382894, 2.177432]
          // Leaflet initialization
          var map = window.L.map('map')

          // Set Center of map and zoom level
          map.setView(center, 14)

          // Tiles provider
          var titleProvider = window.L.tileLayer(
            "${tile.url}",
            {
              minZoom: ${tile.minZoom},
              maxZoom: ${tile.maxZoom},
              attribution: "${tile.attributions.map((attribution: MapAttribution) => {
                if (!attribution.link) return attribution.linkText
                return `<a href=${attribution.link} target='_blank'>${attribution.linkText}</a>`
              }).join(' | ')}"
            }
          )
          titleProvider.addTo(map)

          delete L.Icon.Default.prototype._getIconUrl;
          window.L.Icon.Default.mergeOptions({
            iconUrl: '/marker-icon.png',
            iconRetinaUrl: '/marker-icon-2x.png',
            shadowUrl: '/marker-shadow.png'
          })
          // Add a humble marker
          const markers = ${JSON.stringify(markers)}
          markers.map((marker) => {
            var marker = window.L.marker([marker.lat, marker.long])
            marker.addTo(map)
          })
        `,
      }}
    />
  )
}

type Props = {
  community: string,
  mapId: string
}
const Map = ({ community, mapId }: Props) => {
  return (
    <CommunityProvider community={community} mapId={mapId}>
      <div id='map' className='bg-gray-50 w-[1000px] h-[600px]'></div>
      <MapWrapper />
    </CommunityProvider>
  )
}

export default Map
