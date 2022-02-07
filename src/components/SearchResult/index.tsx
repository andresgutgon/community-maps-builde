import cn from 'classnames'
import { geocoders } from 'leaflet-control-geocoder'
type GeocodingResult = geocoders.GeocodingResult

const cleanEmptyParts = (parts: Array<string | null>): null | string => {
  const partsWithContent = parts.filter((p) => p && p !== '(undefined)')
  if (!partsWithContent) return null

  return partsWithContent.join(' ')
}

const useResult = (result: GeocodingResult) => {
  const name = result.name
  const address = result.properties['address'] || {}
  const amenity = cleanEmptyParts([address.amenity])
  const street = cleanEmptyParts([
    address.road,
    address.house_number,
    address.building
  ])
  const city = cleanEmptyParts([
    address.city,
    address.town,
    `(${address.postcode})`
  ])
  const country = cleanEmptyParts([address.state, address.country])
  if (!street && !city && !country) {
    return { street: name, amenity: null, city: null, country: null }
  }

  return { amenity, street, city: city || name, country }
}

type Props = { result: GeocodingResult }
const SearchResult = ({ result }: Props) => {
  const { amenity, street, city, country } = useResult(result)
  return (
    <span className='flex flex-col text-left'>
      <span className='text-sm text-gray-800'>
        {street}
        {amenity ? (
          <>
            &nbsp;(
            <strong className='text-xs text-gray-600 font-medium'>
              {amenity}
            </strong>
            )
          </>
        ) : null}
      </span>
      {city && (
        <span
          className={cn({
            'text-xs text-gray-400': street,
            'text-sm text-gray-800': !street
          })}
        >
          {city}
        </span>
      )}
      {country && <span className='text-xs  text-gray-400'>{country}</span>}
    </span>
  )
}

export default SearchResult
