import { NextApiRequest, NextApiResponse } from 'next'

import withBearerTokenInServer from '@maps/lib/middlewares/withBearerTokenInServer'
import data from '@maps/data/demoData'

const COMMUNITY_TYPES = {
  mobility: 'mobility',
  housing: 'housing',
  energy: 'energy'
}
// Each type has an icon?

type CommunityType = keyof typeof COMMUNITY_TYPES
const communityServerMap = (_req: NextApiRequest, response: NextApiResponse) => {
  response.status(200).json({
    type: COMMUNITY_TYPES.mobility,

  })
}

export default withBearerTokenInServer(communityServerConfig)
