import { ReactNode, createContext, useEffect, useState, useContext } from 'react'

import { Marker, Config } from '@maps/types/index'

interface ContextProps {
  markers: Array<Marker>;
  config: Config | null;
  loading: boolean
}
const CommunityContext = createContext<ContextProps | null>({
  config: null,
  loading: true,
  markers: []
})

type ProviderProps = {
  children: ReactNode,
  community: string,
  mapId: string
}

export const CommunityProvider = ({ community, mapId, children }: ProviderProps) => {
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState(null)
  const [markers, setMarkers] = useState([])
  useEffect(() => {
    async function loadData () {
      const [configResponse, markersResponse] = await Promise.all([
        fetch(`/api/${community}/config`),
        fetch(`/api/${community}/maps/${mapId}/markers`)
      ])
      // Config and Map types
      const config = await configResponse.json()
      setConfig(config)

      // Markers
      const markers = await markersResponse.json()
      setMarkers(markers)

      setLoading(false)
    }
    loadData()
  }, [community, mapId])
  return (
    <CommunityContext.Provider value={{ loading, markers, config }}>
      {children}
    </CommunityContext.Provider>
  )
}

export const useMap = () => {
  const context = useContext(CommunityContext)

  if (context === undefined) {
    throw new Error('useCommunityMap must be used within a CommunityPropvider')
  }

  return context
}
