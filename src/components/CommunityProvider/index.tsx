import { Dispatch, SetStateAction, useRef, ReactNode, createContext, useEffect, useState, useContext } from 'react'
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
  apiBase: string
}
const CommunityContext = createContext<ContextProps | null>({
  places: [],
  categories: [],
  allPlaces: [],
  currentPlace: null,
  setPlaces: null,
  config: null,
  loading: true,
  urlParams: null,
  apiBase: null
})

type ProviderProps = {
  children: ReactNode,
  community: string,
  mapId: string
}

export const CommunityProvider = ({ community, mapId, children }: ProviderProps) => {
  const apiBase = useRef(`/api/${community}/maps/${mapId}`).current
  const { filter } = useFilters()
  const { loadingUrlParams, urlParams, onLoadCategories } = useQueryString()
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

      setLoading(false)
    }
    loadData()
  }, [
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
