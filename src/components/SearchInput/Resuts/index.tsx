import { MutableRefObject, forwardRef, SyntheticEvent, useCallback, useEffect } from 'react'
import { FocusScope, useFocusManager } from '@react-aria/focus'
import { FormattedMessage } from 'react-intl'
import cn from 'classnames'

import type { GeocodingResult } from '@maps/components/SearchInput/geocoders'
import { ResutsListProps, ResultsTopSpace, ResultsXSpace } from '@maps/components/SearchInput/useSearchInputProps'

const RESULTS_TOP: Record<ResultsTopSpace, string> = { sm: 'top-12', normal: 'top-14'}
const RESULTS_X_SPACE: Record<ResultsXSpace, string> = { normal: 'sm:-left-2 sm:-right-2 ' }

const cleanEmptyParts = (parts: Array<string | null>): null | string => {
  const partsWithContent = parts.filter(p => p && p !== '(undefined)')
  if (!partsWithContent) return null

  return partsWithContent.join(' ')
}

const useResult = (result: GeocodingResult) => {
  const name = result.name
  const address = result.properties['address'] || {}
  const amenity = cleanEmptyParts([ address.amenity ])
  const street = cleanEmptyParts([ address.road, address.house_number, address.building ])
  const city= cleanEmptyParts([ address.city, address.town, `(${address.postcode})`])
  const country = cleanEmptyParts([address.state, address.country ])
  if (!street && !city && !country) {
    return { street: name, amenity: null, city: null, country: null }
  }

  return { amenity, street, city: city || name, country }
}

type ResultItemProps = {
  result: GeocodingResult
  onClick: (result: GeocodingResult) => void
  onEsc: () => void
}
const ResultItem = forwardRef<HTMLButtonElement, ResultItemProps>(function ResultItemButton (
  { onEsc, result, onClick }, ref
) {
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
  const { amenity, street, city, country } = resultParts
  return (
    <button
      ref={ref}
      onClick={() => onClick(result)}
      className='px-3 py-1 focus:bg-gray-100 cursor-pointer w-full focus:outline-none focus:ring-0'
      onKeyDown={onKeyDown}
    >
      <span className='flex flex-col text-left'>
        <span className='text-sm text-gray-800'>
          {street}
          {amenity ? (
            <>&nbsp;(<strong className='text-xs text-gray-600 font-medium'>{amenity}</strong>)</>
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
        {country && (
          <span className='text-xs  text-gray-400'>{country}</span>
        )}
      </span>
    </button>
  )
})
const ESC_KEY = 27
type Props = {
  resultsListProps: ResutsListProps,
  results: GeocodingResult[],
  onClickResult: (result: GeocodingResult) => void,
  onEscape: () => void,
  firstResultRef: MutableRefObject<HTMLButtonElement | null>
}
const SearchResults = ({ resultsListProps, results, onClickResult, onEscape, firstResultRef }: Props) => {
  const escFunction = useCallback((event: KeyboardEvent) => {
    if(event.keyCode === ESC_KEY) { event.stopPropagation() }
  }, [])
  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)
    return () => { document.removeEventListener('keydown', escFunction, false) }
  }, [escFunction])
  return (
    <ul
      className={cn(
        'rounded border border-gray-300 shadow py-1 absolute left-0 right-0 bg-white',
        RESULTS_TOP[resultsListProps.top],
        RESULTS_X_SPACE[resultsListProps.xSpace],
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
        <FocusScope contain restoreFocus autoFocus>
          {results.map((result: GeocodingResult, index: number) => {
            const refProp = index === 0 ? { ref: firstResultRef } : {}
            return (
              <li key={index}>
                <ResultItem
                  {...refProp}
                  result={result}
                  onClick={onClickResult}
                  onEsc={onEscape}
                />
              </li>
            )
          })}
        </FocusScope>
      )}
    </ul>
  )
}

export default SearchResults
