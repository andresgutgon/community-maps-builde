import { NextApiRequest, NextApiResponse } from 'next'

import withHeaderBearerToken from '@maps/lib/middlewares/withHeaderBearerToken'
import type { ResponseWithAuth } from '@maps/lib/middlewares/withHeaderBearerToken'

const formSubmit = async ({ request, response, tokenHeaders, communityHost }: ResponseWithAuth) => {
  const { slug } = request.query
  console.log('HOLA')
  const serverResponse = await fetch(
    `${communityHost}/maps/forms/${slug}`,
    {
      method: request.method,
      headers: tokenHeaders
    }
  )
  const data = await serverResponse.json()
  response.status(serverResponse.status).json(data)
}

export default withHeaderBearerToken(formSubmit)
