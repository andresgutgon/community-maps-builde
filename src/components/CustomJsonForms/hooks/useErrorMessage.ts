import { useIntl } from 'react-intl'

import { FormReturnType } from '@maps/components/CustomJsonForms/hooks/useForm'
import { MUST_ACCEPT_TERMS } from '@maps/components/LegalCheck'

type UseErrorMessageProps = { form: FormReturnType | null }
type UserErrorMessageReturnType = { message: null | string, showError: boolean }
export const useErrorMessage = ({ form }: UseErrorMessageProps): UserErrorMessageReturnType => {
  const intl = useIntl()
  const error = form?.response?.data?.message

  if (error === MUST_ACCEPT_TERMS) return { showError: false, message: error }

  const defaultError = intl.formatMessage({ defaultMessage: 'Hubo un error al enviar la información', id: 'gNB19l' })
  const message = error || defaultError
  return {
    showError: form?.response?.ok === false,
    message
  }
}
