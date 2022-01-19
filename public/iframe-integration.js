;(function () {
  const script = document.getElementById('community-maps-builder')
  const iframeId = script.getAttribute('data-iframe-id')
  const iframe = document.getElementById(iframeId)?.contentWindow
  const { pathname, search: queryString, origin: baseUrl } = window.location
  const url = `${baseUrl}${pathname}`

  if (!iframe) return // Sorry no iframe nothing

  window.addEventListener(
    'message',
    (event) => {
      const { type } = event.data
      if (type === 'GET_URL') {
        iframe.postMessage(
          {
            type: 'GET_PARAMS_FROM_PARENT',
            baseUrl,
            url,
            queryString
          },
          '*'
        )
      } else if (type === 'SET_URL') {
        const params = new URLSearchParams(window.location.search)
        params.set('mapFilters', event.data.mapFilters)
        const qs = encodeURI(params.toString())
        const urlWithQuery = `${url}?${qs}`
        window.history.replaceState(null, '', urlWithQuery)
      }
    },
    false
  )
})()
