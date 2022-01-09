import { useIntl } from 'react-intl'

import { useMapData } from '@maps/components/CommunityProvider'

export enum Method { GET = 'GET', POST = 'POST' }
const buildUrl = (community: string, path: string) => `/api/${community}/maps/${path}`
type Request = {
  method: Method
  path: string
  body?: Object
}
export type Response = {
  ok: boolean,
  message: string,
  data?: any
}
const useMakeRequest = () => {
  const intl = useIntl()
  const { community } = useMapData()
  const defaultError = intl.formatMessage({ defaultMessage: 'Hubo un error inesperado en el servidor, Por favor intentalo de nuevo', id: 'H3Kz8v' })

  return async ({ method, path, body }: Request): Promise<Response> => {
    try {
      const response = await fetch(
        buildUrl(community, path),
        {
          method,
          ...(body ?  { body: JSON.stringify(body) } : {})
        }
      )
      const responseData: Response = await response.json()
      return responseData
    } catch {
      return { ok: false, message: defaultError}
    }
  }
}

export default useMakeRequest
