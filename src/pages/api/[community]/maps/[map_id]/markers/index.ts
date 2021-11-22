import { NextApiRequest, NextApiResponse } from 'next'

import withHeaderBearerToken from '@maps/lib/middlewares/withHeaderBearerToken'
import type { ResponseWithAuth } from '@maps/lib/middlewares/withHeaderBearerToken'

const markers = async ({ request, response, tokenHeaders, communityHost }: ResponseWithAuth) => {
  const { map_id } = request.query
  const serverResponse = await fetch(
    `${communityHost}/maps/${map_id}/markers`,
    {
      method: 'GET',
      headers: tokenHeaders
    }
  )
  const data = await serverResponse.json()
  response.status(200).json(data)
}

export default withHeaderBearerToken(markers)
