import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useMap } from 'react-leaflet'
import { geocoders } from 'leaflet-control-geocoder'
type GeocodingResult = geocoders.GeocodingResult

import ReactControl from '@maps/components/ReactControl/index'
import {
  ResultsXSpace,
  useSearchInputProps
} from '@maps/components/SearchInput/useSearchInputProps'
import Button, {
  Types as ButtonTypes,
  Styles as ButtonStyles
} from '@maps/components/Button'

type FakeSearchProps = { onClick?: () => void; disabled?: boolean }
const FakeSearch = ({ onClick, disabled = false }: FakeSearchProps) => {
  const { placeholder, buttonLabel, formClasses, inputClasses } =
    useSearchInputProps({
      resultsXSpace: ResultsXSpace.normal
    })
  return (
    <div
      {...(onClick
        ? { onClick, className: formClasses }
        : { className: formClasses })}
    >
      <input
        disabled={disabled}
        className={inputClasses}
        placeholder={placeholder}
        type='text'
      />
      <Button disabled style={ButtonStyles.branded} type={ButtonTypes.submit}>
        {buttonLabel}
      </Button>
    </div>
  )
}

type Props = { locale: string }
const SearchControl = ({ locale }: Props) => {
  const [Search, setSearch] = useState(null)
  const map = useMap()
  const onClick = async () => {
    const Component = await dynamic(
      () => import('@maps/components/SearchInput/InMap'),
      { loading: () => <FakeSearch disabled /> }
    )
    setSearch(Component)
  }
  const onSearch = (result: GeocodingResult) => {
    map.fitBounds(result.bbox)
  }
  return (
    <ReactControl
      className='leaflet-search leaflet-expanded-control'
      position='topleft'
    >
      {Search ? (
        <Search locale={locale} onSearch={onSearch} />
      ) : (
        <FakeSearch onClick={onClick} />
      )}
    </ReactControl>
  )
}

export default SearchControl
