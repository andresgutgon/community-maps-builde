import { useIntl } from 'react-intl'
import { UISchemaElement, Translator } from '@jsonforms/core'
import { ErrorObject } from 'ajv'
export const useTranslateError = () => {
  const intl = useIntl()
  return (
    error: ErrorObject,
    _translate: Translator,
    uischema: UISchemaElement
  ): string => {
    const params = error.params
    switch(error.keyword) {
      case 'required':
        const fieldName = ((uischema as any)?.label || params.missingProperty || '').toLowerCase()
        return intl.formatMessage(
          { id: '3Fs00I', defaultMessage: 'El campo {fieldName} es obligatorio' },
          { fieldName }
        )
        break;
      case 'format':
        const format = params.format
        if (format === 'email') {
          return intl.formatMessage({
            id: 'zaaFVR',
            defaultMessage: 'El formato de email no es válido'
          })
        }
        return error.message
        break;
      case 'type':
        const type = params.type
        console.log('KEYWORD', error.keyword)
        console.log('TYPE', type)
        if (type === 'integer') {
          return intl.formatMessage({
            id: '1uGo7W',
            defaultMessage: 'Este campo es numérico'
          })
        }
        return error.message
        break;
      default:
        return error.message
    }
  }
}
