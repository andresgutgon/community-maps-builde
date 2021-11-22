import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import demoData from '@maps/data/demoData'
import type { Map } from '@maps/types/index'

export type ResponseWithMap = {
  request: NextApiRequest,
  response: NextApiResponse,
  map: Map
}
type NextApiHandlerWithMap<T = any> = (responseWithAuth: ResponseWithMap) => void | Promise<void>

/**
 * This middleware put dummy config in the request
 */
const withMap = (handler: NextApiHandlerWithMap) => (request: NextApiRequest, response: NextApiResponse) => {
  const { maps } = demoData.config
  const { map_id } = request.query
  const map = maps.find(map => map.slug === map_id)

  if (!map) {
    return response.status(404).send({
      message: 'Map not found'
    })
  }

  return handler({ request, response, map })
}

export default withMap
