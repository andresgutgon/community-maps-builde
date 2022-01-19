
import { MUST_ACCEPT_TERMS } from '@maps/components/LegalCheck'
import withHeaderBearerToken from '@maps/lib/middlewares/withHeaderBearerToken'
import type { ResponseWithAuth } from '@maps/lib/middlewares/withHeaderBearerToken'


const formSubmit = async ({ request, response, tokenHeaders, communityHost }: ResponseWithAuth) => {
  let termsAccepted = false
  try {
   termsAccepted = JSON.parse(request.body).data.legalTermsAccepted
  } catch { termsAccepted = false }

  if (!termsAccepted) {
    return response.status(422).json({ message: MUST_ACCEPT_TERMS })
  }
  const serverResponse = await fetch(
    `${communityHost}/maps/forms`,
    {
      method: request.method,
      headers: tokenHeaders,
      body: request.body
    }
  )
  const data = await serverResponse.json()
  response.status(serverResponse.status).json(data)
}

export default withHeaderBearerToken(formSubmit)
