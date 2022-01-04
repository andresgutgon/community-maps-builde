import { useIntl } from 'react-intl'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { JsonFormsStyleContext, vanillaCells } from '@jsonforms/vanilla-renderers'
import { JsonForms } from '@jsonforms/react'

import renderers from '@maps/components/CustomJsonForms/renderers'
import { formStyles } from '@maps/components/CustomJsonForms/styles'
import type { Category } from '@maps/types/index'
import { FormReturnType } from '@maps/components/CustomJsonForms/hooks/useForm'

type Props = { form: FormReturnType }
const Form = ({ form }: Props) => {
  const intl = useIntl()
  return (
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
        i18n={form.i18n}
      />
    </JsonFormsStyleContext.Provider>
  )
}

export default Form
