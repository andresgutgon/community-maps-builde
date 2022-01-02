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
const forms = ['first-form', 'bike_charger', null]
const randomProgress = (min, max) => {
  const amount = Math.floor(Math.random() * (max - min + 1)) + min
  return {
    amount,
    completed: amount === 100
  }
}

let completedContributionItems = 0

/**
 * This is a one off script to populate places
 * for the demo data. Ignore if you're not developing in this repo.
 * The data should be already in `./src/data/places.json`
 */
async function fetchPlaces () {
  const response = await fetch('https://www.sommobilitat.coop/wp-admin/admin-ajax.php?action=getparkings')
  const data = await response.json()
  const parkings = data.data.parkings
  const places = parkings.map(place => {
    const [lat, lng] = place.position.split(',')
    const categorySlug = mobilityCategories[
      Math.floor(Math.random() * mobilityCategories.length)
    ]
    const formSlug = forms[
      Math.floor(Math.random() * forms.length)
    ]
    const slug = place.name
    const name = place.title
    const address = new RegExp(/\sa\sdecidir/).test(place.address)
      ? null
      : place.address
    const progress = randomProgress(0, 100)
    let goalProgress = progress.amount
    const completed = progress.completed
    if (!completed && completedContributionItems <= 20) {
      completedContributionItems += 1
      goalProgress = 100
    }
    return {
      lat: lat.trim(),
      lng: lng.trim(),
      name,
      slug,
      address,
      goalProgress,
      active: STATUS_MAPPING[place.parking_status] === 'active',
      category_slug:  categorySlug,
      form_slug: formSlug
    }
  })

  fs.writeFileSync(
    './src/data/places.json',
    JSON.stringify(places)
  )
}

fetchPlaces()
