import { NextApiRequest, NextApiResponse } from 'next'

import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import withMap from '@maps/lib/middlewares/mockServer/withMap'
import type { ResponseWithMap } from '@maps/lib/middlewares/mockServer/withMap'
import places from '@maps/data/places.json'
import config from '@maps/data/config'
import { Category } from '@maps/types/index'

const communityServerMap = ({ map, response }: ResponseWithMap) => {
  const categories: string[] = Object.values(config.categories).filter(
    (category: Category) => category.map_slug === map.slug
  ).map((c: Category) => c.slug)
  const placesForMap = places.filter(
    place => categories.includes(place.category_slug)
  )
  response.status(200).json(placesForMap)
}

export default withBearerToken(withMap(communityServerMap))
