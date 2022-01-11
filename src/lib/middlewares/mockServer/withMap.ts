import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import maps from '@maps/data/maps.json'
import placesOneCategory from '@maps/data/places-one-category.json'
import placesMultipleCategories from '@maps/data/places-multiple-categories.json'
import type { Place, Map } from '@maps/types/index'

export type ResponseWithMap = {
  request: NextApiRequest
  response: NextApiResponse
  places: Place[]
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
      ok: false,
      message: 'Map not found'
    })
  }

  const places = map.slug === 'one-category'
    ? placesOneCategory
    : placesMultipleCategories
  return handler({ request, response, map, places })
}

export default withMap
