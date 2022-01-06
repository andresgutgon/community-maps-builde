import { useRef, ChangeEvent, useState } from 'react'
import { useKeyboard } from '@react-aria/interactions'
import { useMap, useMapEvents } from 'react-leaflet'

import Button, { Size as ButtonSize, Types as ButtonTypes, Styles as ButtonStyles } from '@maps/components/Button'
import type { GeocodingResult } from '@maps/components/SearchInput/geocoders'
import { GeocoderService } from '@maps/types/index'
import { Props as UseSearchProps, useSearchInputProps } from '@maps/components/SearchInput/useSearchInputProps'
import useGeocoder from './useGeocoder'
import SearchResults from './Resuts'

type AddressResult = {
  street: string | null,
  detail: string | null,
  context: string | null
}

export type SearchInputProps = UseSearchProps & { locale: string }
const SearchInput = ({
  locale,
  resultsTopSpace,
  resultsXSpace,
  inputClasses: inputClassesProp,
  buttonStyle,
  inputButtonSeparation,
  buttonOutline,
  buttonRounded,
  buttonWithShadow,
  buttonShowFocus
}: SearchInputProps) => {
  const {
    placeholder,
    buttonLabel,
    formClasses,
    inputClasses,
    buttonProps,
    resultsListProps
  } = useSearchInputProps({
    buttonStyle,
    inputClasses: inputClassesProp,
    resultsTopSpace,
    resultsXSpace,
    inputButtonSeparation,
    buttonOutline,
    buttonRounded,
    buttonWithShadow,
    buttonShowFocus
  })
  const firstResultRef = useRef(null)
  const [focused, setFocus] = useState(false)
  const map = useMap()
  const [visible, setVisible] = useState(false)
  const [searching, setSearching] = useState(false)
  const geocoder = useGeocoder({ service: GeocoderService.nominatim, locale })
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<GeocodingResult[]>([])
  const onEscape = () => {
    setVisible(false)
  }
  useMapEvents({ click: onEscape, mousedown: onEscape })
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }
  const onEscapeSearch = (event) => {
  }
  const onClickSearch = async () => {
    if (!search) return

    setSearching(true)
    geocoder.geocode(search, (results: GeocodingResult[]) => {
      setResults(results)
      setVisible(true)
      setSearching(false)
    })
  }
  const onClickResult = (result: GeocodingResult) => {
    setVisible(false)
    setResults([])
    setSearch('')
    map.fitBounds(result.bbox)
  }
  const { keyboardProps } = useKeyboard({
    onKeyDown: (event) => {
      switch (event.key) {
        case 'Enter':
          onClickSearch()
        case 'Escape':
          setVisible(false)
          break
        case 'ArrowDown':
        case 'Tab':
          if (!results.length) {
            onClickSearch()
          }
          setVisible(true)
          if (firstResultRef) {
            firstResultRef?.current?.focus()
          }
          break
      }
    }
  })
  const disabled = !search || searching
  return (
    <div className='relative'>
      <div className={formClasses}>
        <input
          {...keyboardProps}
          type='text'
          autoFocus
          autoComplete='off'
          value={search}
          className={inputClasses}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        <Button
          withShadow={buttonProps.withShadow}
          focused={buttonProps.showFocus && focused}
          outline={buttonProps.outline}
          disabled={disabled}
          onClick={() => onClickSearch()}
          rounded={buttonProps.rounded}
          style={buttonProps.style}
          size={buttonProps.size}
          type={buttonProps.type}
        >
          {buttonLabel}
        </Button>
      </div>
      {visible && (
        <SearchResults
          resultsListProps={resultsListProps}
          results={results}
          onClickResult={onClickResult}
          onEscape={onEscape}
          firstResultRef={firstResultRef}
        />
      )}
    </div>
  )
}

export default SearchInput

