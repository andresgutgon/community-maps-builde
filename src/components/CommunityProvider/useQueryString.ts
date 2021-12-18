import { useEffect, useMemo, useState } from 'react'

const DEFAULT_HOST_RETURN = { isIframe: false, host: null }
type ReturnTypeHostWindow = {
  host: Window | null,
  isIframe: boolean
}
function useHostWindow ():  ReturnTypeHostWindow {
  return useMemo(() => {
    try {
      const isIframe = window.self !== window.parent
      if (!isIframe) return DEFAULT_HOST_RETURN
      return {
        host: window.parent,
        isIframe: true
      }
    } catch (e) {
      return DEFAULT_HOST_RETURN
    }
  }, [])
}

const DEFAULT_URL_PARAMS = { placeSlug: null }
type UrlParam = {
  placeSlug: string | null
}
type ReturnType = {
  loadingUrlParams: boolean
  urlParams: UrlParam
}
const useQueryString = (): ReturnType => {
  const [loadingUrlParams, setLoading] = useState(true)
  const [urlParams, setUrlParams] = useState<null | UrlParam>(DEFAULT_URL_PARAMS)
  const { host, isIframe } = useHostWindow()

  useEffect(() => {
    function handleMessage (event: MessageEvent) {
      if (event.data.type === 'SET_PARAMS_FROM_PARENT') {
        setUrlParams({ placeSlug: event.data.queryParams.mapPlace })
        setLoading(false)
      }
    }

    if (isIframe) {
      window.addEventListener('message', handleMessage)
      // Ask parent window about their URL params
      host.postMessage({ type: 'GET_URL' }, '*')
    } else {
      const queryString = window.location.search
      const params = new URLSearchParams(queryString)
      setUrlParams({ placeSlug: params.get('mapPlace') })
      setLoading(false)
    }
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [host, isIframe])

  return { loadingUrlParams, urlParams }
}

export default useQueryString
