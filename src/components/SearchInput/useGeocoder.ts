import { useMemo } from 'react'
import type { IGeocoder } from '@maps/components/SearchInput/geocoders'

import { nominatim } from './geocoders/index'
import { GeocoderService } from '@maps/types/index'

type UseGeocoderProps = {
  service: GeocoderService,
  locale: string
}
const useGeocoder = ({ service, locale }: UseGeocoderProps): IGeocoder => {
  return useMemo(
    () => {
      switch(service) {
        case GeocoderService.nominatim:
          return nominatim({
            geocodingQueryParams: { 'accept-language': locale }
          })
      }

      throw new Error(`Geocoder service (${service}) not supported`);
    },
    [service, locale]
  )
}
export default useGeocoder
