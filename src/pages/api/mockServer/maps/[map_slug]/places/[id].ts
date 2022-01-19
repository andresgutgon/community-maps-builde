
import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import withMap from '@maps/lib/middlewares/mockServer/withMap'
import type { ResponseWithMap } from '@maps/lib/middlewares/mockServer/withMap'
import vielhaPlace from '@maps/data/places/som-mobilitat-vielha.json'
import defaultPlace from '@maps/data/places/default.json'

const communityServerMap = ({ request, places, response }: ResponseWithMap) => {
  const { id } = request.query
  const place = places.find(p => p.slug  === id)

  if (!place) {
    response.status(404).json({ message: 'place not found' })
  }

  let placeDetail = id === 'som-mobilitat-vielha'
    ? vielhaPlace
    : defaultPlace
  const detail = {
    ...placeDetail,
    schemaData: {
      ...placeDetail.schemaData,
      progress: place.goalProgress
    }
  }
  response.status(200).json({ ...place, ...detail })
}

export default withBearerToken(withMap(communityServerMap))
