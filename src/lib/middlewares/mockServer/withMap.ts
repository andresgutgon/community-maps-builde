import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import config from '@maps/data/config'
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
  const { maps } = config
  const slug = (request.query.map_slug || '').toString()
  const map = maps[slug]

  if (!map) {
    return response.status(404).send({
      message: 'Map not found'
    })
  }

  return handler({ request, response, map })
}

export default withMap
