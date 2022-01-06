import { Dispatch, SetStateAction } from 'react'
import { useIntl } from 'react-intl'
import { JsonFormsStyleContext, vanillaCells } from '@jsonforms/vanilla-renderers'
import { JsonForms } from '@jsonforms/react'

import renderers from '@maps/components/CustomJsonForms/renderers'
import { formStyles } from '@maps/components/CustomJsonForms/styles'
import type { Category } from '@maps/types/index'
import SuccessMessage from '@maps/components/Dialog/SuccessMessage'
import ErrorMessage from '@maps/components/Dialog/ErrorMessage'
import LegalCheck from '@maps/components/LegalCheck'
import { useErrorMessage } from '@maps/components/CustomJsonForms/hooks/useForm'
import { FormReturnType } from '@maps/components/CustomJsonForms/hooks/useForm'
import { SuggestReturnType } from '@maps/components/SuggestPlaceControl/useSuggest'

type Props = { suggest: SuggestReturnType }
const FormStep = ({ suggest }: Props) => {
  const intl = useIntl()
  const { form, legalTermsAccepted, setLegalTermsAccepted } = suggest
  const error = useErrorMessage({ form })
  return (
    <>
      <ErrorMessage show={error.showError} message={error.message} />
      <SuccessMessage
        show={!!form?.submitResponse?.ok}
        message={form?.submitResponse?.message}
      />
      <JsonFormsStyleContext.Provider value={formStyles}>
        <JsonForms
          schema={form.jsonSchema}
          uischema={form.uiSchema}
          data={form.data}
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
  )
}

export default FormStep
