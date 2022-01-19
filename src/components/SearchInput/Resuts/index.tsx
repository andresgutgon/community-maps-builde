import { MutableRefObject, forwardRef, useCallback, useEffect } from 'react'
import { FocusScope, useFocusManager } from '@react-aria/focus'
import { FormattedMessage } from 'react-intl'
import cn from 'classnames'

import type { GeocodingResult } from '@maps/components/SearchInput/geocoders'
import {
  ResutsListProps,
  ResultsTopSpace,
  ResultsXSpace
} from '@maps/components/SearchInput/useSearchInputProps'
import SearchResult from '@maps/components/SearchResult'

const RESULTS_TOP: Record<ResultsTopSpace, string> = {
  sm: 'top-12',
  normal: 'top-14'
}
const RESULTS_X_SPACE: Record<ResultsXSpace, string> = {
  normal: 'sm:-left-2 sm:-right-2 '
}

type ResultItemProps = {
  result: GeocodingResult
  onClick: (result: GeocodingResult) => void
  onEsc: () => void
}
const ResultItem = forwardRef<HTMLButtonElement, ResultItemProps>(
  function ResultItemButton({ onEsc, result, onClick }, ref) {
    const focusManager = useFocusManager()
    const onKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowDown':
          focusManager.focusNext({ wrap: true })
          break
        case 'ArrowUp':
          focusManager.focusPrevious({ wrap: true })
          break
        case 'Escape':
          onEsc()
          break
        case 'Enter':
          onClick(result)
          break
      }
    }
    return (
      <button
        ref={ref}
        onClick={() => onClick(result)}
        className='px-3 py-1 focus:bg-gray-100 cursor-pointer w-full focus:outline-none focus:ring-0'
        onKeyDown={onKeyDown}
      >
        <SearchResult result={result} />
      </button>
    )
  }
)
const ESC_KEY = 27
type Props = {
  resultsListProps: ResutsListProps
  results: GeocodingResult[]
  onClickResult: (result: GeocodingResult) => void
  onEscape: () => void
  firstResultRef: MutableRefObject<HTMLButtonElement | null>
}
const SearchResults = ({
  resultsListProps,
  results,
  onClickResult,
  onEscape,
  firstResultRef
}: Props) => {
  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.keyCode === ESC_KEY) {
      event.stopPropagation()
    }
  }, [])
  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)
    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
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
            <FormattedMessage
              defaultMessage='Lo sentimos, no hay resultados para esta dirección'
              id='Pga9q2'
            />
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
