import { NextApiRequest, NextApiResponse } from 'next'

import findCommunity from '@maps/lib/findCommunity'

type CustomHeaders = Headers & {
  'API-KEY': string
}

/**
 * This middleware adds secret token to the response based on [community] param
 * curl https://community-odoo-server.org/maps/config
 *    -H "Accept: application/json"
 *    -H "API-KEY: SUPER_SECRET_TOKEN"
 */
export type ResponseWithAuth = {
  request: NextApiRequest
  response: NextApiResponse
  tokenHeaders: CustomHeaders
  communityHost: string
}
type NextApiHandlerWithToken = (
  responseWithAuth: ResponseWithAuth
) => void | Promise<void>
const withHeaderBearerToken =
  (handler: NextApiHandlerWithToken) =>
  (request: NextApiRequest, response: NextApiResponse) => {
    const slug = request.query.community?.toString() || ''
    const community = findCommunity(slug)

    if (!community) {
      return response.status(402).send({
        message: 'Not community defined for this map'
      })
    }

    var tokenHeaders = new Headers({
      'API-KEY': community.token
    }) as CustomHeaders
    if (request.method != 'GET') {
      tokenHeaders.set('Content-Type', 'application/json')
    }
    return handler({
      request,
      response,
      tokenHeaders,
      communityHost: community.host
    })
  }

export default withHeaderBearerToken
