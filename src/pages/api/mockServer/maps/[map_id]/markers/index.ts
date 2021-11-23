import { NextApiRequest, NextApiResponse } from 'next'

import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import withMap from '@maps/lib/middlewares/mockServer/withMap'
import type { ResponseWithMap } from '@maps/lib/middlewares/mockServer/withMap'
import markers from '@maps/data/markers.json'

const communityServerMap = ({ map, response }: ResponseWithMap) => {
  const mapTypeIds = map.map_types.map(mapType => mapType.id)
  const markersForMap = markers.filter(
    marker => mapTypeIds.includes(marker.mapTypeId)
  )
  response.status(200).json(markersForMap)
}

export default withBearerToken(withMap(communityServerMap))
