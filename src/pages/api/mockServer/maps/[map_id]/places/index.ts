import { NextApiRequest, NextApiResponse } from 'next'

import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import withMap from '@maps/lib/middlewares/mockServer/withMap'
import type { ResponseWithMap } from '@maps/lib/middlewares/mockServer/withMap'
import places from '@maps/data/places.json'

const communityServerMap = ({ map, response }: ResponseWithMap) => {
  const mapTypeIds = map.map_types.map(mapType => mapType.id)
  const placesForMap = places.filter(
    place => mapTypeIds.includes(place.mapTypeId)
  )
  response.status(200).json(placesForMap)
}

export default withBearerToken(withMap(communityServerMap))
