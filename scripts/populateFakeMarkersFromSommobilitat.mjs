import fetch from 'node-fetch'
import fs from 'fs'

const STATUS_MAPPING = {
  "En procés": "founding",
  "Previst": "planned",
  "Operatiu": "active"
}
const mobilityCategories = [
  'car', 'van', 'bike_charger', 'car_charger'
]
const randomProgress = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

/**
 * This is a one off script to populate markers
 * for the demo data. Ignore if you're not developing in this repo.
 * The data should be already in `./src/data/markers.json`
 */
async function fetchMarkers () {
  const response = await fetch('https://www.sommobilitat.coop/wp-admin/admin-ajax.php?action=getparkings')
  const data = await response.json()
  const markers = data.data.parkings.map(marker => {
    const [lat, long] = marker.position.split(',')
    const categoryType = mobilityCategories[
      Math.floor(Math.random() * mobilityCategories.length)
    ]
    const address = new RegExp(/Adreça a decidir/).test('Adreça a decidir')
      ? null
      : marker.address
    return {
      lat: lat.trim(),
      long: long.trim(),
      name: marker.title,
      slug: marker.name,
      address,
      active: STATUS_MAPPING[marker.parking_status] === 'active',
      categoryType,
      goalProgress: randomProgress(0, 100),
      mapTypeId: 1 // Hardcoded for now
    }
  })

  fs.writeFileSync(
    './src/data/markers.json',
    JSON.stringify(markers)
  )
}

fetchMarkers()
