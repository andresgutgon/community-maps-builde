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
import { useErrorMessage } from '@maps/components/CustomJsonForms/hooks/useErrorMessage'

type Props = {
  isOpen: boolean
  place: PlaceType | null
  closeFn: () => void,
  onLoadingFinish: () => void
}
export default function SubmissionForm ({ isOpen, closeFn, place, onLoadingFinish }: Props) {
  const intl = useIntl()
  const [legalTermsAccepted, setLegalTermsAccepted] = useState<boolean>(false)
  const currentEntity = { entity: place, entityType: EntityForm.place }
  const form = useForm({
    entities: [currentEntity],
    currentEntity,
    getExtraData: () => ({ legalTermsAccepted })
  })
  const error = useErrorMessage({ form })
  useEffect(() => {
    if (form) return
    onLoadingFinish()
    closeFn()
  }, [closeFn, onLoadingFinish, form])
  const onClose = () => {
    form.reset(() => {
      setLegalTermsAccepted(false)
    })
    closeFn()
  }

  if (!form) return null

  const defaultButtonLabel = intl.formatMessage({ id: 'IOnTHc', defaultMessage: 'Participar' })
  const buttonLabel = form?.instance?.formButtonLabel || defaultButtonLabel
  const submit = form.submitting
    ? `${intl.formatMessage({ id: 'tClzXv', defaultMessage: 'Enviando' })}...`
    : buttonLabel
  const showForm = !form?.response?.ok
  const disabled = !form?.valid || form.submitting
  return (
    <Dialog
      onSubmit={form.onSubmit}
      onLoadingFinish={onLoadingFinish}
      isOpen={isOpen}
      title={showForm ? place?.name : null}
      description={showForm ? form?.instance?.description : null}
      onClose={onClose}
      closeFn={onClose}
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
              onClick={onClose}
            >
              <FormattedMessage defaultMessage='Cancelar' id='nZLeaQ' />
            </Button>
          ) : null}
        </>
      }
    >
      <ErrorMessage show={error.showError} message={error.message} />
      <SuccessMessage
        show={!!form?.response?.ok}
        message={form?.response?.message}
      />
      {showForm ? (
        <>
          <JsonFormsStyleContext.Provider value={formStyles}>
            <JsonForms
              schema={form.instance.jsonSchema}
              uischema={form.instance.uiSchema}
              data={form.data}
              config={{ showUnfocusedDescription: true }}
              renderers={renderers}
              cells={vanillaCells}
              onChange={form.onChange}
              validationMode={form.validationMode}
              i18n={form.i18n}
            />
          </JsonFormsStyleContext.Provider>
          <LegalCheck
            error={error.message}
            checked={legalTermsAccepted}
            onCheck={(accepted: boolean) => setLegalTermsAccepted(accepted)}
          />
        </>
      ) : null}
    </Dialog>
  )
}
