import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import findCommunity from '@maps/lib/findCommunity'

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
  const community = findCommunity(slug)

  if (!community) {
    return response.status(402).send({
      ok: false,
      message: 'Not community defined for this map'
    })
  }

  var tokenHeaders = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${community.token}`
  })
  return handler({
    request,
    response,
    tokenHeaders,
    communityHost: community.host
  })
}

export default withHeaderBearerToken
