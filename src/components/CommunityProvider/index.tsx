import { useMemo, Dispatch, SetStateAction, useRef, ReactNode, createContext, useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'

import { Category, Place, Config } from '@maps/types/index'
import LoadingMap from '@maps/components/LoadingMap'
import useQueryString, { UrlParam } from '@maps/components/CommunityProvider/useQueryString'
import useFilters from '@maps/components/FilterControl/useFilters'

interface ContextProps {
  places: Place[]
  categories: Category[]
  setPlaces: Dispatch<SetStateAction<Place[]>>
  allPlaces: Place[]
  currentPlace: Place | null
  config: Config | null
  loading: boolean,
  urlParams: UrlParam,
  apiBase: string,
  mapUrl: string,
  community: string
}
const CommunityContext = createContext<ContextProps | null>({
  places: [],
  categories: [],
  allPlaces: [],
  community: null,
  currentPlace: null,
  setPlaces: null,
  config: null,
  loading: true,
  urlParams: null,
  apiBase: null,
  mapUrl: null
})

type ProviderProps = {
  children: ReactNode,
  community: string,
  mapId: string
}

export const CommunityProvider = ({ community, mapId, children }: ProviderProps) => {
  const themeCssTag = useMemo<HTMLStyleElement>(() => {
    const cssStyleTag = document.createElement('style')
    cssStyleTag.setAttribute('id', 'theme-brand-colors')
    document.head.appendChild(cssStyleTag)
    return cssStyleTag
  }, [])
  const apiBase = useRef(`/api/${community}/maps/${mapId}`).current
  const { filter } = useFilters()
  const { loadingUrlParams, urlParams, onLoadCategories, mapUrl } = useQueryString()
  const [config, setConfig] = useState(null)
  const [places, setPlaces] = useState<Place[]>([])
  const allPlaces = useRef<Place[]>([])
  const categories = useRef<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPlace, setCurrentPlace] = useState<null | Place>(null)
  useEffect(() => {
    // Wait for parent host page to return URL info
    if (!loading || loadingUrlParams) return

    async function loadData () {
      let current = null
      // Places are async
      fetch(`${apiBase}/places`)
        .then((response) => response.json())
        .then(data => {
          allPlaces.current = data
          if (urlParams.placeSlug) {
            current = allPlaces.current.find((place: Place) =>
              place.slug === urlParams.placeSlug
            )
            setCurrentPlace(current)
          }

          setPlaces(filter(allPlaces.current, urlParams.filters))
        })

      const configResponse = await fetch(`${apiBase}/config`)
      const config = await configResponse.json()
      const categorySlugs = Object.keys(config.categories)
      onLoadCategories(categorySlugs)
      categories.current = categorySlugs.map((key: string) => config.categories[key])
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
    themeCssTag,
    apiBase,
    loadingUrlParams,
    community,
    mapId,
    loading,
    filter,
    urlParams,
    onLoadCategories
  ])

  // when only one place is displayed reset places collection
  // when user close the popup of that place
  return (
    <CommunityContext.Provider
      value={{
        community,
        mapUrl,
        urlParams,
        currentPlace,
        loading,
        allPlaces: allPlaces.current,
        setPlaces,
        places,
        config,
        categories: categories.current,
        apiBase
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
