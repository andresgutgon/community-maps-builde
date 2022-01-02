import { Fragment, lazy, useEffect, useState, SyntheticEvent } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { JsonSchema } from '@jsonforms/core'
import { JsonFormsStyleContext, vanillaCells } from '@jsonforms/vanilla-renderers'
import { JsonForms } from '@jsonforms/react'

import LegalCheck from '@maps/components/LegalCheck'
import renderers from '@maps/components/CustomJsonForms/renderers'
import Button, { Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import Dialog from '@maps/components/Dialog'
import type { Place as PlaceType } from '@maps/types/index'
import { formStyles } from '@maps/components/CustomJsonForms/styles'
import SuccessMessage from '@maps/components/Dialog/SuccessMessage'
import ErrorMessage from '@maps/components/Dialog/ErrorMessage'
import { EntityForm, useForm } from '@maps/components/CustomJsonForms/hooks/useForm'

type translatableJsonSchema = JsonSchema & { translations?: Record<string, string> }
type Props = {
  isOpen: boolean
  place: PlaceType | null
  closeFn: () => void,
  onLoadingFinish: () => void
}
export default function SubmissionForm ({ isOpen, closeFn, place, onLoadingFinish }: Props) {
  const intl = useIntl()
  const [legalTermsAccepted, setLegalTermsAccepted] = useState<boolean>(false)
  const form = useForm({ entity: place, entityType: EntityForm.place, isOpen })

  useEffect(() => {
    if (form) return
    onLoadingFinish()
    closeFn()
  }, [closeFn, onLoadingFinish, form])

  if (!form) return null

  const defaultButtonLabel = intl.formatMessage({ id: 'IOnTHc', defaultMessage: 'Participar' })
  const buttonLabel = form.formButtonLabel || defaultButtonLabel
  const submit = form.submitting
    ? `${intl.formatMessage({ id: 'tClzXv', defaultMessage: 'Enviando' })}...`
    : buttonLabel
  const showForm = !form?.submitResponse?.ok
  const disabled = !legalTermsAccepted || !form.isValid || form.submitting
  return (
    <Dialog
      onSubmit={form.onSubmit}
      onLoadingFinish={onLoadingFinish}
      isOpen={isOpen}
      title={showForm ? place?.name : null}
      description={showForm ? form.description : null}
      onClose={closeFn}
      closeFn={closeFn}
      footer={
        <>
          {showForm ? (
            <Button
              disabled={disabled}
              type={ButtonType.submit}
              fullWidth
              style={ButtonStyles.branded}
            >
              {submit}
            </Button>
          ) : null}
          {showForm ? (
            <Button
              disabled={form.submitting}
              fullWidth
              outline
              style={ButtonStyles.secondary}
              onClick={closeFn}
            >
              <FormattedMessage defaultMessage='Cancelar' id='nZLeaQ' />
            </Button>
          ) : null}
        </>
      }
    >
      {(form?.submitResponse?.ok === false && form?.submitResponse?.message) ? (
        <ErrorMessage key={form.submitting.toString()} message={'Error in the server'} />
      ) : null}
      <SuccessMessage
        show={!!form?.submitResponse?.ok && !!form?.submitResponse?.message}
        message={form?.submitResponse?.message}
      />
      {showForm ? (
        <>
          <JsonFormsStyleContext.Provider value={formStyles}>
            <JsonForms
              schema={form.jsonSchema}
              uischema={form.uiSchema}
              data={form.data}
              config={{ showUnfocusedDescription: true }}
              renderers={renderers}
              cells={vanillaCells}
              onChange={form.onChange}
              validationMode={form.validationMode}
              i18n={{
                translateError: form.translateError,
                translate: (id: string, defaultMessage: string): string => {
                  const parts = id?.split('.')
                  if (!parts) return defaultMessage

                  const propertyKey = parts[0]

                  if (!propertyKey) return defaultMessage

                  const key = Object.keys(form.jsonSchema.properties).find(
                    (propKey: string) => propKey === propertyKey
                  )
                  if (!key) return defaultMessage
                  const translations = (form.jsonSchema.properties[key] as translatableJsonSchema)?.translations || {}

                  return translations[parts[1]] || defaultMessage
                }
              }}
            />
          </JsonFormsStyleContext.Provider>
          <LegalCheck onCheck={(accepted: boolean) => setLegalTermsAccepted(accepted)} />
        </>
      ) : null}
    </Dialog>
  )
}
