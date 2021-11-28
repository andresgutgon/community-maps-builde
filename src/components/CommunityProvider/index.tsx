import { ReactNode, createContext, useEffect, useState, useContext } from 'react'

import { Marker, Config } from '@maps/types/index'

interface ContextProps {
  places: Array<Marker>;
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
      const [configResponse, placesResponse] = await Promise.all([
        fetch(`/api/${community}/config`),
        fetch(`/api/${community}/maps/${mapId}/markers`)
      ])
      // Config and Map types
      const config = await configResponse.json()
      setConfig(config)

      // Places
      const places = await placesResponse.json()
      setPlaces(places)

      setLoading(false)
    }
    loadData()
  }, [community, mapId])
  return (
    <CommunityContext.Provider value={{ loading, places, config }}>
      {children}
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
