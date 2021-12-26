import { NextApiRequest, NextApiResponse } from 'next'

import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'

type FakeResponse = { status: number; message: { ok: boolean, error?: string }}
const formSubmit = (request: NextApiRequest, response: NextApiResponse) => {
  const { slug } = request.query
  const serverResponse: FakeResponse= request.method === 'POST'
    ? { status: 200, message: { ok: true }}
    : { status: 422, message: { ok: false, error: 'Error in the server' }}

  response.status(serverResponse.status).json(serverResponse.message)
}

export default withBearerToken(formSubmit)
