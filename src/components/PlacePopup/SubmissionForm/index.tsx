import { lazy, useEffect, useState, SyntheticEvent } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useIntl, FormattedMessage } from 'react-intl'
import { JsonSchema } from '@jsonforms/core'
import { JsonFormsStyleContext, vanillaCells } from '@jsonforms/vanilla-renderers'
import { JsonForms } from '@jsonforms/react'

import renderers from '@maps/components/CustomJsonForms/renderers'
import Button, { Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import Dialog from '@maps/components/Dialog'
import type { Place as PlaceType } from '@maps/types/index'
import { formStyles } from '@maps/components/CustomJsonForms/styles'
import { useForm } from '@maps/components/CustomJsonForms/hooks/useForm'

type translatableJsonSchema = JsonSchema & { translations?: Record<string, string> }
type Props = {
  isOpen: boolean
  place: PlaceType | null
  closeFn: () => void,
  onLoadingFinish: () => void
}
export default function SubmissionForm ({ isOpen, closeFn, place, onLoadingFinish }: Props) {
  const intl = useIntl()
  const { locale } = useRouter()
  const form = useForm({ place, isOpen })

  useEffect(() => {
    if (form) return
    onLoadingFinish()
    closeFn()
  }, [closeFn, onLoadingFinish, form])

  if (!form) return null

  return (
    <Dialog
      onSubmit={form.onSubmit}
      onLoadingFinish={onLoadingFinish}
      isOpen={isOpen}
      title={place?.name}
      description={intl.formatMessage({
        id: 'ArcHyA',
        defaultMessage: "Els compromisos d'aportacions només es demanarà que es facin efectius si s'assoleixen el 100% dels compromisos per finançar el vehicle. Som Mobilitat informarà les persones sòcies quan s'hagi assolit l'objectiu econòmic",
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
            {!form.formButtonLabel ? (
              <FormattedMessage defaultMessage='Participar' id="IOnTHc" />
            ) : form.formButtonLabel}
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
    </Dialog>
  )
}
