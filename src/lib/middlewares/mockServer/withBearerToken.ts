import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

/**
 * This middleware ensure that an API route MUST receive a valid
 * request.headers["api-key"] = '[SECRET_TOKEN_HASH_HERE]'
 */
const withBearerToken = (handler: NextApiHandler) => (request: NextApiRequest, response: NextApiResponse) => {
  const token = request.headers["api-key"]?.toString() || 'NO_TOKEN'
  const communityToken = process.env.DEMO_SECRET_TOKEN

  if (token === communityToken) {
    return handler(request, response)
  }

  response.status(401).send({ message: 'Unauthorized request' })
}

export default withBearerToken
