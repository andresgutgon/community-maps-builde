import { useIntl } from 'react-intl'

export enum Method { GET = 'GET', POST = 'POST' }
type BuildUrlProps = {
  community: string
  path: string
  mapSlug?: string
}
const buildUrl = ({ community, mapSlug, path }: BuildUrlProps) =>
  `/api/${community}/maps${mapSlug ? `/${mapSlug}` : ''}/${path}`
type Request = {
  method: Method
  path: string
  body?: Object
}
export type Response = {
  ok: boolean,
  message?: string,
  data?: any
}
type Props = { community: string, mapSlug?: string }
const useMakeRequest = ({ community, mapSlug }: Props) => {
  const intl = useIntl()
  const defaultError = intl.formatMessage({ defaultMessage: 'Hubo un error inesperado en el servidor, Por favor intentalo de nuevo', id: 'H3Kz8v' })

  return async ({ method, path, body }: Request): Promise<Response> => {
    try {
      const response = await fetch(
        buildUrl({ community, mapSlug, path }),
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
