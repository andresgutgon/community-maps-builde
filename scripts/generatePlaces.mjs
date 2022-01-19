import fs from 'fs'

import categories from '../src/data/categories.json'
import sommobilitatPlaces from '../scripts/sommobilitat.json'

const allCategories = Object.values(categories)
const STATUS_MAPPING = {
  'En procés': 'founding',
  Previst: 'planned',
  Operatiu: 'active'
}
const forms = ['first-form', 'bike_charger', null]
const randomProgress = (min, max) => {
  const amount = Math.floor(Math.random() * (max - min + 1)) + min
  return {
    amount,
    completed: amount === 100
  }
}

function buildCategorySlug(mapSlug) {
  if (mapSlug === 'one-category') return categories.car.slug

  return allCategories[Math.floor(Math.random() * allCategories.length)].slug
}

let completedContributionItems = 0
function buildMap({ mapSlug, parkings }) {
  const places = parkings.map((place) => {
    const [lat, lng] = place.position.split(',')
    const formSlug = forms[Math.floor(Math.random() * forms.length)]
    const categorySlug = buildCategorySlug(mapSlug)
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
      name,
      slug,
      map_slug: mapSlug,
      category_slug: categorySlug,
      form_slug: formSlug,
      active: STATUS_MAPPING[place.parking_status] === 'active',
      lat: lat.trim(),
      lng: lng.trim(),
      address,
      goalProgress
    }
  })

  fs.writeFileSync(`./src/data/places-${mapSlug}.json`, JSON.stringify(places))
}

/**
 * This is a one off script to populate places
 * for the demo data. Ignore if you're not developing in this repo.
 * The data should be already in `./src/data/places.json`
 */
async function buildMaps() {
  const maps = [
    {
      name: 'One category',
      slug: 'one-category',
      description: 'Possibly the most common use case'
    },
    {
      name: 'Multiple categories',
      slug: 'multiple-categories',
      description: 'Showcase a map with multiple categories'
    }
  ]
  fs.writeFileSync('./src/data/maps.json', JSON.stringify(maps))
  maps.forEach((map) =>
    buildMap({ mapSlug: map.slug, parkings: sommobilitatPlaces })
  )
}

buildMaps()
