import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'

const MapRoute = () => {
  const Map = dynamic(
    () => import('@maps/components/Map'),
    { ssr: false } // This line is important. It's what prevents server-side render
  )
  const router = useRouter()

  if (!router.query.community || !router.query.id) {
    return null
  }

  const { community, id } = router.query
  return (
    <div className="container flex items-center p-4 mx-auto min-h-screen justify-center">
      <Map
        community={community?.toString() || ''}
        mapId={id?.toString() || ''}
      />
    </div>
  )
}

export default MapRoute
