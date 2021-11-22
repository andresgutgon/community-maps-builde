import Head from 'next/head'
import Script from 'next/script'

// TODO:
// - Make a Provider / Reducer
// - Handle API errors 404/402
const useMap = () => {

}

const Map = () => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin="" />
      </Head>

      <div className="container flex items-center p-4 mx-auto min-h-screen justify-center">
        <div id='map' className='bg-gray-50 w-[1000px] h-[600px]'></div>
      </div>

      <Script
        id='getStarted'
        dangerouslySetInnerHTML={{
          __html: `
            var center = [41.382894, 2.177432]
            // Leaflet initialization
            var map = L.map('map')

            // Set Center of map and zoom level
            map.setView(center, 14)

            // Tiles provider
            var titleProvider = L.tileLayer(
              'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }
            )
            titleProvider.addTo(map)

            // Add a humble marker
            var marker = L.marker(center)
            marker.addTo(map)
          `,
        }}
      />
    </>
  )
}

export default Map
