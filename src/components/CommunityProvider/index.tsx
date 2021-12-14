import { ReactNode, createContext, useEffect, useState, useContext } from 'react'
import { FormattedMessage } from 'react-intl'

import { Place, Config } from '@maps/types/index'
import LoadingMap from '@maps/components/LoadingMap'

interface ContextProps {
  places: Array<Place>;
  config: Config | null;
  loading: boolean
}
const CommunityContext = createContext<ContextProps | null>({
  config: null,
  loading: true,
  places: []
})

type ProviderProps = {
  children: ReactNode,
  community: string,
  mapId: string
}

export const CommunityProvider = ({ community, mapId, children }: ProviderProps) => {
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState(null)
  const [places, setPlaces] = useState([])
  useEffect(() => {
    async function loadData () {
      // Places are async
      fetch(`/api/${community}/maps/${mapId}/places`)
        .then((response) => response.json())
        .then(data => { setPlaces(data) })

      const configResponse = await fetch(`/api/${community}/config`)
      const config = await configResponse.json()
      setConfig(config)

      setLoading(false)
    }
    loadData()
  }, [community, mapId])
  return (
    <CommunityContext.Provider value={{ loading, places, config }}>
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
