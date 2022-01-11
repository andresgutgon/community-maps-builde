import fetch from 'node-fetch'
import fs from 'fs'

async function fetchPlaces () {
  const response = await fetch('https://www.sommobilitat.coop/wp-admin/admin-ajax.php?action=getparkings')
  const data = await response.json()

  fs.writeFileSync('./scripts/sommobilitat.json', JSON.stringify(data.data.parkings))
}

fetchPlaces()
