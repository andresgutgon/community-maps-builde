(function () {
  const script = document.getElementById('community-maps-builder')
  const iframeId = script.getAttribute('data-iframe-id')
  const iframe = document.getElementById(iframeId)?.contentWindow

  if (!iframe) return // Sorry no iframe nothing

  window.addEventListener("message", (event) => {
    const { type } = event.data
    if (type === 'GET_URL') {
      const { search: queryString, origin: baseUrl } = window.location
      iframe.postMessage({
        type: 'GET_PARAMS_FROM_PARENT', baseUrl, queryString
      }, '*')
    } else if (type === 'SET_URL') {
      const params = new URLSearchParams(window.location.search)
      params.set('mapFilters', event.data.mapFilters)
      const qs = encodeURI(params.toString())
      const url = `${window.location.origin}${window.location.pathname}?${qs}`
      window.history.replaceState(null, '', url)
    }
 }, false);
})()
