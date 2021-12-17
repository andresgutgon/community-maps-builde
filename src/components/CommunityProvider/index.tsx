import { ReactNode, createContext, useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'

import { Place, Config } from '@maps/types/index'
import LoadingMap from '@maps/components/LoadingMap'


function useHostWindow ():  null | Window {
  try {
    const isIframe = window.self !== window.parent
    if (!isIframe) return null
    return window.parent
  } catch (e) {
    return null
  }
}

const DEFAULT_URL_PARAMS = { placeSlug: null }
type UrlParam = {
  placeSlug: string | null
}
type ReturnTypeQueryString = {
  loadingUrlParams: boolean
  urlParams: UrlParam
}
const useQueryString = (): ReturnTypeQueryString => {
  const [loadingUrlParams, setLoading] = useState(true)
  const [urlParams, setUrlParams] = useState<null | UrlParam>(DEFAULT_URL_PARAMS)
  const parentWindow = useHostWindow()

  useEffect(() => {
    function handleMessage (event: MessageEvent) {
      if (event.data.type === 'SET_PARAMS_FROM_PARENT') {
        setUrlParams({ placeSlug: event.data.queryParams.mapPlace })
        setLoading(false)
      }
    }

    if (parentWindow) {
      window.addEventListener('message', handleMessage)
      // Ask parent window about their URL params
      parentWindow.postMessage({ type: 'GET_URL' }, '*')
    } else {
      const queryString = window.location.search
      const params = new URLSearchParams(queryString)
      setUrlParams({ placeSlug: params.get('mapPlace') })
      setLoading(false)
    }
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [parentWindow])

  return { loadingUrlParams, urlParams }
}

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
  const { loadingUrlParams, urlParams } = useQueryString()
  console.log('placeSlug', urlParams.placeSlug)

  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState(null)
  const [places, setPlaces] = useState([])
  useEffect(() => {
    // Wait for parent host page to return URL info
    if (loadingUrlParams) return

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
  }, [community, mapId, loadingUrlParams])
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
