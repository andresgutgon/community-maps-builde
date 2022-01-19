import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import withMap from '@maps/lib/middlewares/mockServer/withMap'
import type { ResponseWithMap } from '@maps/lib/middlewares/mockServer/withMap'

const communityServerMap = ({ places, response }: ResponseWithMap) => {
  response.status(200).json(places)
}

export default withBearerToken(withMap(communityServerMap))
