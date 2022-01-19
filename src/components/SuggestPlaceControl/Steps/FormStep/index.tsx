import {
  JsonFormsStyleContext,
  vanillaCells
} from '@jsonforms/vanilla-renderers'
import { JsonForms } from '@jsonforms/react'

import renderers from '@maps/components/CustomJsonForms/renderers'
import { formStyles } from '@maps/components/CustomJsonForms/styles'
import SuccessMessage from '@maps/components/Dialog/SuccessMessage'
import ErrorMessage from '@maps/components/Dialog/ErrorMessage'
import { useErrorMessage } from '@maps/components/CustomJsonForms/hooks/useErrorMessage'
import { SuggestReturnType } from '@maps/components/SuggestPlaceControl/useSuggest'
import defaultOptions from '@maps/components/CustomJsonForms/defaultOptions'

type Props = { suggest: SuggestReturnType }
const FormStep = ({ suggest }: Props) => {
  const { form } = suggest
  const error = useErrorMessage({ form })

  if (!form) return null

  return (
    <>
      <ErrorMessage show={error.showError} message={error.message} />
      <SuccessMessage response={form?.response} />
      {!form.response?.ok ? (
        <JsonFormsStyleContext.Provider value={formStyles}>
          <JsonForms
            schema={form.instance.jsonSchema}
            uischema={form.instance.uiSchema}
            data={form.data}
            config={defaultOptions}
            renderers={renderers}
            cells={vanillaCells}
            onChange={form.onChange}
            validationMode={form.validationMode}
            i18n={form.i18n}
          />
        </JsonFormsStyleContext.Provider>
      ) : null}
    </>
  )
}

export default FormStep
