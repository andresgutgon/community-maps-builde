// Styles from Leaflet and plugins
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import * as L from 'leaflet'
import 'leaflet.markercluster'
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
          // var center = [41.382894, 2.177432]
          // Leaflet initialization
          var map = window.L.map('map')

          // Set Center of map and zoom level
          // map.setView(center, 9)

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

          // Set the right icon URLs
          delete L.Icon.Default.prototype._getIconUrl;
          window.L.Icon.Default.mergeOptions({
            iconUrl: '/marker-icon.png',
            iconRetinaUrl: '/marker-icon-2x.png',
            shadowUrl: '/marker-shadow.png'
          })

          // Marker clusters
          var markersCluster = window.L.markerClusterGroup({
            showCoverageOnHover: false,
            disableClusteringAtZoom: 12,
            removeOutsideVisibleBounds: true
          });

          const fitBoundsPadding = [${markers.length > 20 ? '1, 1' : '100, 100'}]
          const markersData = ${JSON.stringify(markers)}

          // Instantiate LatLngBounds object
          var bounds = window.L.latLngBounds()

          const markerList = markersData.map(({ lat, long, name: title }) => {
            const latLong = [lat, long]

            // Extend LatLngBounds with coordinates
            bounds.extend(latLong)

            const marker = window.L.marker(latLong, { title })
            marker.bindPopup(\`{ lat: '\$\{lat\}', long: '\$\{long\}\', name: '\$\{title\}' }\`)
            return marker
          })

          map.fitBounds(bounds, { padding: fitBoundsPadding})

          // Add markers to the cluster
          markersCluster.addLayers(markerList)

          // Add cluster to the map
          map.addLayer(markersCluster)
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
