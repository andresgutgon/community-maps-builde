import { NextApiRequest, NextApiResponse } from 'next'

import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import withMap from '@maps/lib/middlewares/mockServer/withMap'
import type { ResponseWithMap } from '@maps/lib/middlewares/mockServer/withMap'
import places from '@maps/data/places.json'
import vielhaPlace from '@maps/data/places/som-mobilitat-vielha.json'
import defaultPlace from '@maps/data/places/default.json'
import config from '@maps/data/config'
import { Category } from '@maps/types/index'

const communityServerMap = ({ request, map, response }: ResponseWithMap) => {
  const { id } = request.query
  const place = places.find(p => p.slug  === id)
  if (!place) {
    response.status(404).json({ message: 'place not found' })
  }
  let placeDetail = id === 'som-mobilitat-vielha'
    ? vielhaPlace
    : defaultPlace
  response.status(200).json({
    ...place,
    ...placeDetail
  })
}

export default withBearerToken(withMap(communityServerMap))
