import { NextApiRequest, NextApiResponse } from 'next'

import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import maps from '@maps/data/maps.json'

const communityServerConfig = (
  _req: NextApiRequest,
  response: NextApiResponse
) => {
  response.status(200).json(maps)
}

export default withBearerToken(communityServerConfig)
