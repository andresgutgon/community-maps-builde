import { NextApiRequest, NextApiResponse } from 'next'

import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import config from '@maps/data/config'

const communityServerConfig = (_req: NextApiRequest, response: NextApiResponse) => {
  response.status(200).json(config)
}

export default withBearerToken(communityServerConfig)
