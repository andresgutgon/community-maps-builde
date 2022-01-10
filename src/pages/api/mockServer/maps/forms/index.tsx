import { NextApiRequest, NextApiResponse } from 'next'

import withBearerToken from '@maps/lib/middlewares/mockServer/withBearerToken'
import forms from '@maps/data/forms.json'
import suggestPlaceForms from '@maps/data/suggestPlaceForms.json'

const sleep = (seconds: number) =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000))
type FakeResponse = { status: number; submitResponse: { ok: boolean, message?: null | string }}
const formSubmit = async (request: NextApiRequest, response: NextApiResponse) => {
  const slug = request.body.slug
  const form = forms[slug] || suggestPlaceForms[slug]
  const schrodingerSuccess = [!!form, false][Math.floor(Math.random() * 2)]
  const serverResponse: FakeResponse = request.method === 'POST'
    ? (
      schrodingerSuccess
        ? { status: 200, submitResponse: { ok: true, message: 'Hemos recibido tu solicitud. Gracias!' }}
        : { status: 422, submitResponse: { ok: false, message: 'Hubo un error en el servidor' } }
    )
    : { status: 422, submitResponse: { ok: false, message: 'Error in the server' }}

  // Simulate busy work lol
  await sleep(0.5)
  response.status(serverResponse.status).json(serverResponse.submitResponse)
}

export default withBearerToken(formSubmit)
