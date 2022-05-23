import { useEffect, useMemo, useState } from 'react'

import { State, Filters } from '@maps/components/FilterControl/useFilters'

type ReturnTypeHostWindow = { host: Window; isIframe: boolean }
function useHostWindow(): ReturnTypeHostWindow {
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

const MATCHER = new RegExp(/(?<filterKey>st|cat|cus)\[(?<filterValue>.*)\]/)
const DEFAULT_URL_PARAMS = {
  placeSlug: null,
  filters: { categories: [], state: State.all, custom: [] }
}
export type UrlParam = { placeSlug: string | null; filters: Filters }
function readParams(queryString: string) {
  const states = [
    State.all,
    State.starting,
    State.middle,
    State.finishing,
    State.active
  ]
  const decodeQueryString = decodeURI(queryString)
  const queryParams = new URLSearchParams(decodeQueryString)
  const filtersQuery = queryParams.get('mapFilters')?.split(';') || []
  const filters = filtersQuery.reduce((memo: Filters, item: string) => {
    const filterGroups = item.match(MATCHER)?.groups || {}
    if (Object.keys(filterGroups).length !== 2) return memo

    const { filterKey, filterValue } = filterGroups

    if (filterKey === 'cat') {
      memo.categories = filterValue.split(',') || []
    } else if (filterKey === 'st' && states.includes(filterValue as State)) {
      memo.state = filterValue as State
    } else if (filterKey === 'cus') {
      memo.custom = filterValue.split(',') || []
    }
    return memo
  }, DEFAULT_URL_PARAMS.filters)
  return {
    placeSlug: queryParams.get('mapPlace'),
    filters
  }
}
function writeParams({ categories, state, custom }: Filters): string {
  return `cat[${categories.join(',')}];st[${state}];cus[${custom.join(',')}]`
}

type ReturnType = {
  loadingUrlParams: boolean
  mapUrl: string
  urlParams: UrlParam
  onLoadCategorization: (
    categorySlugs: string[],
    customFilterSlugs: string[]
  ) => void
  changeFiltersInUrl: (filters: Filters) => void
}
const useQueryString = (): ReturnType => {
  const { host, isIframe } = useHostWindow()
  const [queryString, setQueryString] = useState(window.location.search)
  const [loadingUrlParams, setLoading] = useState(true)
  const [urlParams, setUrlParams] = useState<null | UrlParam>(
    DEFAULT_URL_PARAMS
  )
  const [mapUrl, setMapUrl] = useState<string>()

  useEffect(() => {
    function handleMessage({ data }: MessageEvent) {
      if (data.type === 'GET_PARAMS_FROM_PARENT') {
        setUrlParams(readParams(data.queryString))
        setQueryString(data.queryString)
        setMapUrl(data.url)
        setLoading(false)
      }
    }

    if (isIframe) {
      window.addEventListener('message', handleMessage)
      // Ask parent window about their URL params
      host.postMessage({ type: 'GET_URL' }, '*')
    } else {
      const { pathname, origin: baseUrl } = window.location
      setUrlParams(readParams(host.location.search))
      setMapUrl(`${baseUrl}${pathname}`)
      setLoading(false)
    }
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [setMapUrl, host, queryString, isIframe])

  const onLoadCategorization = (
    categorySlugs: string[],
    customFilterSlugs: string[]
  ) => {
    const filters = urlParams.filters
    const categories = filters.categories
    const custom = filters.custom
    const filter_test = {
      ...filters,
      categories: !categories.length
        ? categorySlugs
        : categories.filter((c) => categorySlugs.includes(c)),
      custom: !custom.length
        ? customFilterSlugs
        : custom.filter((c) => customFilterSlugs.includes(c))
    }
    setUrlParams({
      ...urlParams,
      filters: {
        ...filters,
        categories: !categories.length
          ? categorySlugs
          : categories.filter((c) => categorySlugs.includes(c)),
        custom: !custom.length
          ? customFilterSlugs
          : custom.filter((c) => customFilterSlugs.includes(c))
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
  return {
    mapUrl,
    changeFiltersInUrl,
    onLoadCategorization,
    loadingUrlParams,
    urlParams
  }
}

export default useQueryString
