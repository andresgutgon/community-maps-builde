import { NextApiRequest, NextApiResponse } from 'next'

import withBearerTokenInServer from '@maps/lib/middlewares/withBearerTokenInServer'
import data from '@maps/data/demoData'

const communityServerConfig = (_req: NextApiRequest, response: NextApiResponse) => {
  response.status(200).json(data.config)
}

export default withBearerTokenInServer(communityServerConfig)
