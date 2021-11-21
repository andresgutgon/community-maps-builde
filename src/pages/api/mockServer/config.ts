import { NextApiRequest, NextApiResponse } from 'next'

import withBearerTokenInServer from '@maps/lib/middlewares/withBearerTokenInServer'

const communityConfig = (_req: NextApiRequest, response: NextApiResponse) => {
  response.status(200).json({
    theme: {
      color: 'green'
    }
  })
}

export default withBearerTokenInServer(communityConfig)
