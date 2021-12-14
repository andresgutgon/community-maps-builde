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
 * This is a one off script to populate places
 * for the demo data. Ignore if you're not developing in this repo.
 * The data should be already in `./src/data/places.json`
 */
async function fetchPlaces () {
  const response = await fetch('https://www.sommobilitat.coop/wp-admin/admin-ajax.php?action=getparkings')
  const data = await response.json()
  const places = data.data.parkings.map(place => {
    const [lat, lng] = place.position.split(',')
    const categorySlug = mobilityCategories[
      Math.floor(Math.random() * mobilityCategories.length)
    ]
    const slug = place.name
    const name = place.title
    const address = new RegExp(/\sa\sdecidir/).test(place.address)
      ? null
      : place.address
    return {
      lat: lat.trim(),
      lng: lng.trim(),
      name,
      slug,
      address,
      active: STATUS_MAPPING[place.parking_status] === 'active',
      goalProgress: randomProgress(0, 100),
      category_slug:  categorySlug
    }
  })

  fs.writeFileSync(
    './src/data/places.json',
    JSON.stringify(places)
  )
}

fetchPlaces()
