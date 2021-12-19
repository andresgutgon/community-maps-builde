import { SyntheticEvent, ChangeEvent, useState } from 'react'
import cn from 'classnames'
import { FocusScope, useFocusManager } from '@react-aria/focus'
import { useKeyboard } from '@react-aria/interactions'
import { FormattedMessage } from 'react-intl'
import { useMap, useMapEvents } from 'react-leaflet'

import Button, { Types as ButtonTypes, Styles as ButtonStyles } from '@maps/components/Button'
import type { NominatimResult, IGeocoder, GeocodingResult } from '@maps/components/SearchControl/Search/geocoders'
import { CommonProps } from '@maps/components/SearchControl'
import { GeocoderService } from '@maps/types/index'
import useGeocoder from './useGeocoder'

const cleanEmptyParts = (parts: Array<string | null>): null | string => {
  const partsWithContent = parts.filter(p => p)
  if (!partsWithContent) return null

  return partsWithContent.join(' ')
}

type AddressResult = {
  street: string | null,
  detail: string | null,
  context: string | null
}
const useResult = (result: GeocodingResult) => {
  const address = result.properties['address'] || {}
  const street = cleanEmptyParts([ address.building, address.road, address.building ])
  const detail= cleanEmptyParts([ address.city, address.town, address.village, address.hamlet ])
  const context = cleanEmptyParts([address.state, address.country])
  if (!street && !detail && !context) {
    return { street: result.name, detail: null, context: null }
  }

  return { street, detail, context }
}

type ResultItemProps = {
  result: GeocodingResult
  onClick: (result: GeocodingResult) => void
  onEsc: () => void
}
const ResultItem = ({ onEsc, result, onClick }: ResultItemProps) => {
  const focusManager = useFocusManager()
  const resultParts = useResult(result)
  const onKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        focusManager.focusNext({wrap: true});
        break;
      case 'ArrowUp':
        focusManager.focusPrevious({wrap: true});
        break;
      case 'Escape':
        onEsc()
        break;
      case 'Enter':
        onClick(result)
        break;
    }
  }
  const { street, detail, context } = resultParts
  return (
    <button
      onClick={() => onClick(result)}
      className='px-3 py-1 focus:bg-gray-100 cursor-pointer w-full focus:outline-none focus:ring-0'
      onKeyDown={onKeyDown}
    >
      <span className='flex flex-col text-left'>
        <span className='text-sm text-gray-800'>{street}</span>
        {detail && (
          <span
            className={cn({
              'text-xs text-gray-400': street,
              'text-sm text-gray-800': !street
            })}
          >
            {detail}
          </span>
        )}
        {context && (
          <span className='text-xs  text-gray-400'>{context}</span>
        )}
      </span>
    </button>
  )
}

type Props = CommonProps & { locale: string }
const SearchControl = ({
  locale,
  placeholder,
  buttonLabel,
  formClasses,
  inputClasses,
  buttonProps,
}: Props) => {
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
  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()

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
        case 'Escape':
          setVisible(false)
          break
        case 'ArrowDown':
        case 'Tab':
          setVisible(true)
          break
      }
    }
  })
  const disabled = !search || searching
  return (
    <div className='relative'>
      <form onSubmit={onSubmit} autoComplete="off" className={formClasses}>
        <input
          {...keyboardProps}
          type='text'
          autoComplete='off'
          className={inputClasses}
          placeholder={placeholder}
          onChange={onChange}
          value={search}
        />
        <Button
          disabled={disabled}
          style={buttonProps.style}
          type={buttonProps.type}
        >
          {buttonLabel}
        </Button>
      </form>
      {visible && (
        <ul
          className={cn(
            'rounded shadow py-1 absolute top-16 -left-3 -right-3 bg-white',
            { 'bg-white': results.length > 0, 'bg-gray-200': !results.length }
          )}
        >
          {!results.length && (
            <li className='p-3 w-full'>
              <span className='flex flex-col text-center text-sm text-gray-800'>
                <FormattedMessage defaultMessage='Lo sentimos, no hay resultados para esta dirección' id="Pga9q2" />
              </span>
            </li>
          )}
          {results.length > 0 && (
            <FocusScope restoreFocus autoFocus>
              {results.map((result: GeocodingResult, index: number) => (
                <li key={index}>
                  <ResultItem
                    result={result}
                    onClick={onClickResult}
                    onEsc={onEscape}
                  />
                </li>
              ))}
            </FocusScope>
          )}
        </ul>
      )}
    </div>
  )
}

export default SearchControl

