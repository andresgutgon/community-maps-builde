import { NextApiRequest, NextApiResponse } from 'next'

import withHeaderBearerToken from '@maps/lib/middlewares/withHeaderBearerToken'
import type { ResponseWithAuth } from '@maps/lib/middlewares/withHeaderBearerToken'

const places = async ({ request, response, tokenHeaders, communityHost }: ResponseWithAuth) => {
  const { map_slug: slug } = request.query
  const serverResponse = await fetch(
    `${communityHost}/maps/${slug}/places`,
    {
      method: 'GET',
      headers: tokenHeaders
    }
  )
  const data = await serverResponse.json()
  response.status(serverResponse.status).json(data)
}

export default withHeaderBearerToken(places)
