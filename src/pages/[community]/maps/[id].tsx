import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'

const MapRoute = () => {
  // NOTE:
  // This line is important. It's what prevents server-side render
  // Leaflet depends on window therefor doesn't work on the server.
  const Map = dynamic(
    () => import('@maps/components/Map'),
    { ssr: false }
  )
  const router = useRouter()

  if (!router.query.community || !router.query.id) {
    return null
  }


  const { community, id } = router.query
  return (
    <Map community={community?.toString()} mapId={id?.toString()} />
  )
}

export default MapRoute
