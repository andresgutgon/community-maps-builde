import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

function getEnvVarValue (key: string, suffix: string): string | null {
  const keyAsEnv = key.replace('-', '_').toUpperCase()
  return process.env[`${keyAsEnv}${suffix}`]
}

/**
 * This middleware adds secret token to the response based on [community] param
 * curl https://community-odoo-server.org/maps/config
 *    -H "Accept: application/json"
 *    -H "Authorization: Bearer SUPER_SECRET_TOKEN"
 */
export type ResponseWithAuth = {
  request: NextApiRequest,
  response: NextApiResponse,
  tokenHeaders: Headers,
  communityHost: string
}
type NextApiHandlerWithToken<T = any> = (responseWithAuth: ResponseWithAuth) => void | Promise<void>
const withHeaderBearerToken = (handler: NextApiHandlerWithToken) => (request: NextApiRequest, response: NextApiResponse) => {
  const slug = request.query.community?.toString() || ''
  const communityHost = getEnvVarValue(slug, '_HOST')
  const token = getEnvVarValue(slug, '_SECRET_TOKEN')

  if (!communityHost || !slug) {
    return response.status(402).send({
      message: 'Not community defined for this map'
    })
  }

  var tokenHeaders = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  })
  return handler({
    request,
    response,
    tokenHeaders,
    communityHost
  })
}

export default withHeaderBearerToken
