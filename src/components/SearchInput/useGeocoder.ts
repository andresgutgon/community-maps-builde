import { useMemo } from 'react'

import { geocoders } from 'leaflet-control-geocoder'
import { GeocoderService } from '@maps/types/index'

type UseGeocoderProps = {
  service: GeocoderService
  locale: string
}
const useGeocoder = ({
  service,
  locale
}: UseGeocoderProps): geocoders.IGeocoder => {
  return useMemo(() => {
    switch (service) {
      case GeocoderService.nominatim:
        return geocoders.nominatim({
          geocodingQueryParams: { 'accept-language': locale }
        })
    }

    throw new Error(`Geocoder service (${service}) not supported`)
  }, [service, locale])
}
export default useGeocoder
