import { SyntheticEvent, ChangeEvent, useState } from 'react'
import cn from 'classnames'
import { FocusScope, useFocusManager } from '@react-aria/focus'
import { useKeyboard } from '@react-aria/interactions'

import { useMap, useMapEvents } from 'react-leaflet'

import type { NominatimResult, IGeocoder, GeocodingResult } from '@maps/components/SearchControl/geocoders'

import { MapLocale, GeocoderService } from '@maps/types/index'

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

type Props = { locale: MapLocale }
const SearchControl = ({ locale }: Props) => {
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
        case 'ArrowDown':
        case 'Tab':
          setVisible(true)
          break;
      }
    }
  })
  const disabled = !search || searching
  return (
    <div className='relative'>
      <form onSubmit={onSubmit} autoComplete="off" className='space-x-1 '>
        <input
          {...keyboardProps}
          autoComplete='off'
          className='w-[170px] sm:w-[400px] border-none focus:outline-none focus:ring-0 py-2 pl-1 pr-2 placeholder-gray-500 placeholder-opacity-50'
          placeholder={searching ? 'Buscando...' : 'Buscar una dirección...'}
          type='text'
          onChange={onChange}
          value={search}
        />
        {/* FIXME: Do the theming starting with the button */}
        <button type='submit' disabled={disabled} className='rounded bg-[#facb00] text-[#3f3e3e] disabled:bg-gray-200 disabled:bg-opacity-80 py-2 text-base px-4 disabled:text-gray-600 disabled:text-opacity-80 disabled:cursor-default'>
          Buscar
        </button>
      </form>
      {visible && (
        <ul className='rounded shadow py-1 absolute top-14 -left-3 -right-3 bg-white'>
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
        </ul>
      )}
    </div>
  )
}

export default SearchControl
