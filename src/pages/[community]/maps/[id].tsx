import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'

const MapRoute = () => {
  const Map = dynamic(
    () => import('@maps/components/Map'),
    {
      // This line is important. It's what prevents server-side render
      ssr: false,
      loading: () =>
        <div className='absolute inset-0 w-full flex items-center justify-center text-gray-400'>
          Loading...
        </div>
    }
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
