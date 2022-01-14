import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import withMap from '@maps/lib/middlewares/mockServer/withMap'
import type { ResponseWithMap } from '@maps/lib/middlewares/mockServer/withMap'
import config from '@maps/data/config'
import maps from '@maps/data/maps.json'
import categoriesJson from '@maps/data/categories.json'

const communityServerConfig = ({ map, response }: ResponseWithMap) => {
  const categories = map.slug === 'one-category'
    ? { car: categoriesJson.car }
    : categoriesJson
  response.status(200).json({ ...config, categories })
}

export default withBearerToken(withMap(communityServerConfig))
