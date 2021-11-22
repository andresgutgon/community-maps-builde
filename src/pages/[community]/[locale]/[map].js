import Head from 'next/head'
import Script from 'next/script'
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
        <div id='map' className='bg-red-500 w-[1000px] h-[600px]'></div>
      </div>

      <Script
        id='getStarted'
        dangerouslySetInnerHTML={{
          __html: `
            var map = L.map('map').setView([41.382894, 2.177432], 13)
            var Stadia_AlidadeSmooth = L.tileLayer('', {
              maxZoom: 20,
                attribution: ''
                });

            var titleProvider = L.tileLayer(
              'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }
            )

            titleProvider.addTo(map)
          `,
        }}
      />
    </>
  )
}

export default Map
