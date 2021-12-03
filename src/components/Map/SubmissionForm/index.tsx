import { lazy, useEffect, useState, SyntheticEvent } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useIntl, FormattedMessage } from 'react-intl'
import { JsonFormsStyleContext, vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'
import { JsonForms } from '@jsonforms/react'

import Button, { Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import Dialog from '@maps/components/Dialog'
import type { Place as PlaceType } from '@maps/types/index'
import { formStyles } from '@maps/lib/jsonForms/styles'
import useForm from '@maps/hooks/jsonForm/useForm'

type Props = {
  isOpen: boolean
  place: PlaceType | null
  closeFn: () => void
}
export default function SubmissionForm ({ isOpen, closeFn, place }: Props) {
  const intl = useIntl()
  const { locale } = useRouter()
  const form = useForm({ place, isOpen })

  if (!form) return null

  return (
    <Dialog
      onSubmit={form.onSubmit}
      isOpen={isOpen}
      title={place?.name}
      description={intl.formatMessage({
        defaultMessage: 'Selecciona las opciones más adecuadas para tí',
        id: 'CVLHyq'
      })}
      onClose={closeFn}
      closeFn={closeFn}
      footer={
        <>
          <Button
            disabled={!form.isValid}
            type={ButtonType.submit}
            fullWidth
            style={ButtonStyles.branded}
          >
            <FormattedMessage defaultMessage='Participar' id="IOnTHc" />
          </Button>
          <Button
            fullWidth
            outline
            style={ButtonStyles.secondary}
            onClick={closeFn}
          >
            <FormattedMessage defaultMessage='Cancelar' id='nZLeaQ' />
          </Button>
        </>
      }
    >
      <JsonFormsStyleContext.Provider value={formStyles}>
        <JsonForms
          schema={form.jsonSchema}
          uischema={form.uiSchema}
          data={form.data}
          config={{ showUnfocusedDescription: true }}
          renderers={vanillaRenderers}
          cells={vanillaCells}
          onChange={form.onChange}
          validationMode={form.validationMode}
          i18n={{ translateError: form.translateError }}
        />
      </JsonFormsStyleContext.Provider>
    </Dialog>
  )
}
