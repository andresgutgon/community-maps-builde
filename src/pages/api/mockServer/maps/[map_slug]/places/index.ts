import { NextApiRequest, NextApiResponse } from 'next'

import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import withMap from '@maps/lib/middlewares/mockServer/withMap'
import type { ResponseWithMap } from '@maps/lib/middlewares/mockServer/withMap'
import places from '@maps/data/places.json'
import { Category } from '@maps/types/index'

const communityServerMap = ({ map, response }: ResponseWithMap) => {
  response.status(200).json(places)
}

export default withBearerToken(withMap(communityServerMap))
