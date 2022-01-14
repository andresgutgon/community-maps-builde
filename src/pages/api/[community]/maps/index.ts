import { NextApiRequest, NextApiResponse } from 'next'

import withHeaderBearerToken from '@maps/lib/middlewares/withHeaderBearerToken'
import type { ResponseWithAuth } from '@maps/lib/middlewares/withHeaderBearerToken'

const maps = async ({ request, response, tokenHeaders, communityHost }: ResponseWithAuth) => {
  const serverResponse = await fetch(
    `${communityHost}/maps`,
    {
      method: 'GET',
      headers: tokenHeaders
    }
  )
  const data = await serverResponse.json()
  response.status(200).json(data)
}

export default withHeaderBearerToken(maps)
