import { NextApiRequest, NextApiResponse } from 'next'

import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import forms from '@maps/data/forms.json'

const sleep = (seconds: number) =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000))
type FakeResponse = { status: number; submitResponse: { ok: boolean, message?: null | string }}
const formSubmit = async (request: NextApiRequest, response: NextApiResponse) => {
  const { slug } = request.query
  const form = forms[slug.toString()]
  const schrodingerSuccess = [true, false][Math.floor(Math.random() * 2)]
  const serverResponse: FakeResponse = request.method === 'POST'
    ? (
      schrodingerSuccess
        ? { status: 200, submitResponse: { ok: true, message: 'Hemos recibido tu solicitud. Gracias!' }}
        : { status: 404, submitResponse: { ok: false, message: 'Form not found' } }
    )
    : { status: 422, submitResponse: { ok: false, message: 'Error in the server' }}

  // Simulate busy work lol
  await sleep(1)
  response.status(serverResponse.status).json(serverResponse.submitResponse)
}

export default withBearerToken(formSubmit)
