import { NextApiRequest, NextApiResponse } from 'next'

import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import data from '@maps/data/demoData'

const communityServerConfig = (_req: NextApiRequest, response: NextApiResponse) => {
  response.status(200).json(data.config)
}

export default withBearerToken(communityServerConfig)
