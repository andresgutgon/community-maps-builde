import { ReactNode, createContext, useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'

import { Place, Config } from '@maps/types/index'
import LoadingMap from '@maps/components/LoadingMap'
import useQueryString from '@maps/components/CommunityProvider/useQueryString'

interface ContextProps {
  places: Place[];
  currentPlace: Place | null,
  config: Config | null;
  loading: boolean
}
const CommunityContext = createContext<ContextProps | null>({
  places: [],
  currentPlace: null,
  config: null,
  loading: true
})

type ProviderProps = {
  children: ReactNode,
  community: string,
  mapId: string
}

export const CommunityProvider = ({ community, mapId, children }: ProviderProps) => {
  const { loadingUrlParams, urlParams } = useQueryString()
  const [config, setConfig] = useState(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPlace, setCurrentPlace] = useState<null | Place>(null)
  useEffect(() => {
    // Wait for parent host page to return URL info
    if (loadingUrlParams) return

    async function loadData () {
      let current = null
      // Places are async
      fetch(`/api/${community}/maps/${mapId}/places`)
        .then((response) => response.json())
        .then(data => {
          const allPlaces = data
          if (urlParams.placeSlug) {
            current = allPlaces.find((place: Place) =>
              place.slug === urlParams.placeSlug
            )
            setCurrentPlace(current)
          }

          setPlaces(allPlaces)
        })

      const configResponse = await fetch(`/api/${community}/config`)
      const config = await configResponse.json()
      setConfig(config)

      setLoading(false)
    }
    loadData()
  }, [urlParams.placeSlug, community, mapId, loadingUrlParams])

  // when only one place is displayed reset places collection
  // when user close the popup of that place
  return (
    <CommunityContext.Provider
      value={{
        currentPlace,
        loading,
        places,
        config
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
