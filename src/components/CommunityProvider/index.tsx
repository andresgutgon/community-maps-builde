import { useMemo, Dispatch, SetStateAction, useRef, ReactNode, createContext, useEffect, useState, useContext } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'

import { Category, Place, Config } from '@maps/types/index'
import LoadingMap, { LoadingMapType } from '@maps/components/LoadingMap'
import useQueryString, { UrlParam } from '@maps/components/CommunityProvider/useQueryString'
import useFilters from '@maps/components/FilterControl/useFilters'
import useMakeRequest, { Method } from '@maps/hooks/useMakeRequest'
import useMarkersAsString, { MarkersAsString } from '@maps/components/Marker/useMarkersAsString'

enum LoadingErrorType { Map = 'Map', Place = 'Place'}
type LoadingError = {
  type: LoadingErrorType,
  message: string
}
type UseLoadingErrorsProps = { mapSlug: string }
const useLoadingErrors = ({ mapSlug }: UseLoadingErrorsProps): Record<LoadingErrorType, LoadingError> => {
  const intl = useIntl()
  return useRef({
    [LoadingErrorType.Map]: {
      type: LoadingErrorType.Map,
      message: intl.formatMessage({ defaultMessage: 'Hubo un error cargando el mapa con slug {mapSlug}', id: 'c13AgS' }, { mapSlug })
    },
    [LoadingErrorType.Place]: {
      type: LoadingErrorType.Map,
      message: intl.formatMessage({ defaultMessage: 'Hubo un error cargando los puntos en este mapa', id: 'lYL/xX' })
    }
  }).current
}

interface ContextProps {
  controlCssTag: HTMLStyleElement
  places: Place[]
  categories: Category[]
  setPlaces: Dispatch<SetStateAction<Place[]>>
  allPlaces: Place[]
  currentPlace: Place | null
  config: Config | null
  loading: boolean
  urlParams: UrlParam
  mapUrl: string
  mapSlug: string
  community: string
  iconMarkers: MarkersAsString
}
const CommunityContext = createContext<ContextProps | null>({
  controlCssTag: null,
  places: [],
  categories: [],
  allPlaces: [],
  community: null,
  currentPlace: null,
  setPlaces: null,
  config: null,
  loading: true,
  urlParams: null,
  mapUrl: null,
  mapSlug: null,
  iconMarkers: null
})

type ProviderProps = {
  children: ReactNode,
  community: string,
  mapSlug: string
}

export const CommunityProvider = ({ community, mapSlug, children }: ProviderProps) => {
  const makeRequest = useMakeRequest({ community, mapSlug })
  const errors = useLoadingErrors({ mapSlug })
  const [error, setError] = useState<LoadingError | null>(null)
  const { iconMarkers, buildIconMarkers } = useMarkersAsString()
  const controlCssTag = useMemo<HTMLStyleElement>(() => {
    const cssStyleTag = document.createElement('style')
    cssStyleTag.setAttribute('id', 'controls-visibility')
    document.head.appendChild(cssStyleTag)
    return cssStyleTag
  }, [])
  const themeCssTag = useMemo<HTMLStyleElement>(() => {
    const cssStyleTag = document.createElement('style')
    cssStyleTag.setAttribute('id', 'theme-brand-colors')
    document.head.appendChild(cssStyleTag)
    return cssStyleTag
  }, [])
  const { filter } = useFilters()
  const { loadingUrlParams, urlParams, onLoadCategories, mapUrl } = useQueryString()
  const [config, setConfig] = useState(null)
  const [places, setPlaces] = useState<Place[]>([])
  const allPlaces = useRef<Place[]>([])
  const categories = useRef<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchingConfig, setFetchingConfig] = useState(false)
  const [fetchingPlaces, setFetchingPlaces] = useState(false)
  const [currentPlace, setCurrentPlace] = useState<null | Place>(null)
  useEffect(() => {
    // Wait for parent host page to return URL info
    if (error?.type === LoadingErrorType.Map || !loading || loadingUrlParams) return

    async function loadData () {
      let current = null
      // Start fetching places when categories are loaded
      if (categories.current.length > 0 && !fetchingPlaces) {
        // Places are async
        const response = await makeRequest({
          method: Method.GET, path: 'places'
        })

        if (!response.ok) {
          return setError(errors.Place)
        }

        allPlaces.current = response.data
        if (urlParams.placeSlug) {
          current = allPlaces.current.find((place: Place) =>
            place.slug === urlParams.placeSlug
          )
          setCurrentPlace(current)
        }

        setPlaces(filter(allPlaces.current, urlParams.filters))
      }

      if (fetchingConfig) return

      setFetchingConfig(true)
      const configResponse= await makeRequest({
        method: Method.GET, path: `config`
      })

      if (!configResponse.ok) {
        return setError(errors.Map)
      }

      const config = configResponse.data
      const categorySlugs = Object.keys(config.categories)
      onLoadCategories(categorySlugs)

      categories.current = categorySlugs.map((key: string) => config.categories[key])
      // Only fetch once places
      setFetchingPlaces(true)

      // Build icon markers based on categories on this map
      buildIconMarkers(categories.current)

      setConfig(config)
      const themeColor = config.theme.color
      if (themeColor) {
        themeCssTag.innerHTML = `
          :root {
            --color-text-base: ${themeColor.textColorBase};
            --color-fill: ${themeColor.fillColor};
            --color-border: ${themeColor.borderColor};
            --color-button: ${themeColor.buttonColor};
            --color-button-hover: ${themeColor.buttonColorHover};
            --color-text-button: ${themeColor.buttonTextColor};
            --color-text-button-hover: ${themeColor.buttonTextColorHover};
            --color-text-inverted-button: ${themeColor.buttonTextInvertedColor};
            --color-text-inverted-button-hover: ${themeColor.buttonTextInvertedColorHover};
          }
        `
      }

      setLoading(false)
    }
    loadData()
  }, [
    makeRequest,
    errors,
    error,
    setError,
    fetchingPlaces,
    setFetchingPlaces,
    fetchingConfig,
    setFetchingConfig,
    themeCssTag,
    loadingUrlParams,
    community,
    mapSlug,
    loading,
    filter,
    urlParams,
    onLoadCategories,
    buildIconMarkers
  ])

  if (error) {
    return (
      <LoadingMap
        message={error.message}
        type={LoadingMapType.Error}
      />
    )
  }

  return (
    <CommunityContext.Provider
      value={{
        controlCssTag,
        community,
        mapSlug,
        mapUrl,
        urlParams,
        currentPlace,
        loading,
        allPlaces: allPlaces.current,
        setPlaces,
        places,
        config,
        categories: categories.current,
        iconMarkers
      }}
    >
      {loading ? <LoadingMap /> : children}
    </CommunityContext.Provider>
  )
}

export const useMapData = () => {
  const context = useContext(CommunityContext)

  if (context === undefined) {
    throw new Error('useCommunityMap must be used within a CommunityPropvider')
  }

  return context
}
