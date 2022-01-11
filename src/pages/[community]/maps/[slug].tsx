import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'

import LoadingMap from '@maps/components/LoadingMap'

const MapRoute = () => {
  const router = useRouter()
  const { community, slug } = router.query
  // NOTE:
  // This line is important. It's what prevents server-side render
  // Leaflet depends on window therefor doesn't work on the server.
  const Map = dynamic(
    () => import('@maps/components/Map'),
    { ssr: false, loading: () => <LoadingMap /> }
  )

  if (!router.query.community || !router.query.slug) {
    return <LoadingMap />
  }
  return (
    <Map community={community?.toString()} mapSlug={slug?.toString()} />
  )
}

export default MapRoute
