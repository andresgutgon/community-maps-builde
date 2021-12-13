import { NextApiRequest, NextApiResponse } from 'next'

import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import withMap from '@maps/lib/middlewares/mockServer/withMap'
import type { ResponseWithMap } from '@maps/lib/middlewares/mockServer/withMap'
import places from '@maps/data/places.json'
import placeDetail from '@maps/data/placeDetail.json'
import config from '@maps/data/config'
import { Category } from '@maps/types/index'

const communityServerMap = ({ request, map, response }: ResponseWithMap) => {
  const { id } = request.query
  const place = places.find(p => p.slug  === id)
  if (!place) {
    response.status(404).json({ message: 'place not found' })
  }
  response.status(200).json({
    ...place,
    ...placeDetail
  })
  response.status(200).json(placesForMap)
}

export default withBearerToken(withMap(communityServerMap))
