import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import withMap from '@maps/lib/middlewares/mockServer/withMap'
import type { ResponseWithMap } from '@maps/lib/middlewares/mockServer/withMap'
import { Category } from '@maps/types/index'

const communityServerMap = ({ places, response }: ResponseWithMap) => {
  response.status(200).json({ ok: true, data: places })
}

export default withBearerToken(withMap(communityServerMap))
