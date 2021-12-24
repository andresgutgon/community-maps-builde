import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import maps from '@maps/data/maps.json'
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
  const slug = (request.query.map_slug || '').toString()
  const map = maps.find(m => m.slug ===slug)

  if (!map) {
    return response.status(404).send({
      message: 'Map not found'
    })
  }

  return handler({ request, response, map })
}

export default withMap
