import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const NO_TOKEN = 'Bearer NO_TOKEN'

/**
 * This middleware ensure that an API route MUST receive a valid
 * request.headers['authentication'] = 'Bearer [SECRET_TOKEN_HASH_HERE]'
 */
const withBearerToken = (handler: NextApiHandler) => (request: NextApiRequest, response: NextApiResponse) => {
  const [_, token] = (request.headers.authorization || NO_TOKEN).split(' ')
  const communityToken = process.env.DEMO_SECRET_TOKEN

  if (token === communityToken) {
    return handler(request, response)
  }

  response.status(401).send({ message: 'Unauthorized request' })
}

export default withBearerToken
