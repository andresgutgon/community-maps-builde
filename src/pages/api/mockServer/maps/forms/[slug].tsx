import { NextApiRequest, NextApiResponse } from 'next'

import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import forms from '@maps/data/forms.json'

const sleep = (seconds: number) =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000))
type FakeResponse = { status: number; submitResponse: { ok: boolean, message: string }}
const formSubmit = async (request: NextApiRequest, response: NextApiResponse) => {
  const { slug } = request.query
  const form = forms[slug.toString()]
  const serverResponse: FakeResponse = request.method === 'POST'
    ? (
      form
        ? { status: 200, submitResponse: { ok: true, message: 'Hemos recibido tu solicitud. Gracias!' }}
        : { status: 404, submitResponse: { ok: false, message: 'Form not found' } }
    )
    : { status: 422, submitResponse: { ok: false, message: 'Error in the server' }}

  // Simulate busy work lol
  await sleep(2)
  response.status(serverResponse.status).json(serverResponse.submitResponse)
}

export default withBearerToken(formSubmit)
