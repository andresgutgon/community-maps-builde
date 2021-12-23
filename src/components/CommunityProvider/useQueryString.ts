import { useEffect, useMemo, useState } from 'react'

import { ActiveState, Filters } from '@maps/components/FilterControl/useFilters'

type ReturnTypeHostWindow = { host: Window, isIframe: boolean }
function useHostWindow ():  ReturnTypeHostWindow {
  return useMemo(() => {
    try {
      const isIframe = window.self !== window.parent
      if (!isIframe) return { host: window.self, isIframe: false }
      return {
        host: window.parent,
        isIframe: true
      }
    } catch (e) {
      return { host: window.self, isIframe: false }
    }
  }, [])
}

const MATCHER = new RegExp(/(?<filterKey>st|cat|per)\[(?<filterValue>.*)\]/)
const DEFAULT_URL_PARAMS = {
  placeSlug: null,
  filters: { categories: [], activeState: ActiveState.all, percentage: 0 }
}
export type UrlParam = { placeSlug: string | null; filters: Filters }
function readParams (queryString: string) {
  const states = [ActiveState.all, ActiveState.active, ActiveState.inactive]
  const decodeQueryString = decodeURI(queryString)
  console.log('DECODE QUERY STRING', decodeQueryString)
  const queryParams = new URLSearchParams(decodeQueryString)
  const filtersQuery = queryParams.get('mapFilters')?.split(';') || []
  const filters = filtersQuery.reduce((memo: Filters, item: string) => {
    const filterGroups = item.match(MATCHER)?.groups || {}
    if (Object.keys(filterGroups).length !== 2) return memo

    const { filterKey, filterValue } = filterGroups

    if (filterKey === 'st' && states.includes(filterValue as ActiveState)) {
      memo.activeState = filterValue as ActiveState
    } else if (filterKey === 'cat') {
      memo.categories = filterValue.split(',') || []
    } else if (filterKey === 'per') {
      const percentage = +filterValue
      memo.percentage = Number.isInteger(percentage) && percentage >= 0 && percentage <= 100
        ? percentage
        : 0
    }
    return memo
  }, DEFAULT_URL_PARAMS.filters)
  return {
    placeSlug: queryParams.get('mapPlace'),
    filters
  }
}
function writeParams ({ categories, activeState, percentage }: Filters): string {
  return `cat[${categories.join(',')}];st[${activeState}];per[${percentage}]`
}

type ReturnType = {
  loadingUrlParams: boolean
  urlParams: UrlParam
  onLoadCategories: (categorySlugs: string[]) => void,
  changeFiltersInUrl: (filters: Filters) => void
}
const useQueryString = (): ReturnType => {
  const { host, isIframe } = useHostWindow()
  const [queryString, setQueryString] = useState(window.location.search)
  const [loadingUrlParams, setLoading] = useState(true)
  const [urlParams, setUrlParams] = useState<null | UrlParam>(DEFAULT_URL_PARAMS)

  useEffect(() => {
    function handleMessage ({ data }: MessageEvent) {
      if (data.type === 'GET_PARAMS_FROM_PARENT') {
        setUrlParams(readParams(data.queryString))
        setQueryString(data.queryString)
        setLoading(false)
      }
    }

    if (isIframe) {
      window.addEventListener('message', handleMessage)
      // Ask parent window about their URL params
      host.postMessage({ type: 'GET_URL' }, '*')
    } else {
      const params = new URLSearchParams(queryString)
      setUrlParams(readParams(host.location.search))
      setLoading(false)
    }
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [host, queryString, isIframe])

  const onLoadCategories = (categorySlugs: string[]) => {
    const filters = urlParams.filters
    const categories = filters.categories
    setUrlParams({
      ...urlParams,
      filters: {
        ...filters,
        categories: !categories.length
          ? categorySlugs
          : categories.filter(c => categorySlugs.includes(c))
      }
    })
  }

  const changeFiltersInUrl = (filters: Filters) => {
    const params = new URLSearchParams(queryString)
    const mapFilters = writeParams(filters)
    if (isIframe) {
      host.postMessage({ type: 'SET_URL', mapFilters }, '*')
    } else {
      params.set('mapFilters', mapFilters)
      const qs = encodeURI(params.toString())
      const url = `${window.location.origin}${window.location.pathname}?${qs}`
      window.history.replaceState(null, '', url)
    }
  }
  return { changeFiltersInUrl, onLoadCategories, loadingUrlParams, urlParams }
}

export default useQueryString
