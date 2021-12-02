import { useState, SyntheticEvent } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { JsonForms } from '@jsonforms/react'
import { JsonFormsStyleContext, vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'

import Button, { Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import Dialog from '@maps/components/Dialog'
import type { Place as PlaceType } from '@maps/types/index'
import { formStyles } from '@maps/lib/jsonForms/styles'

const jsonSchema = {
  "type":"object",
  "properties":{
    "name":{
      "type":"string",
      "maxLength": 3
    },
    "telephone":{
      "type":"integer"
    },
    "email":{
      "type":"string"
    },
    "identifier":{
      "type":"string"
    }
  },
  "required":[
    "name",
    "telephone",
    "email",
    "identifier"
  ]
}

const uiSchema = {
  "type":"VerticalLayout",
  "elements":[
    {
      "type":"Control",
      "scope":"#/properties/name",
      "label": "Nombre",
    },
    {
      "type":"Control",
      "scope":"#/properties/email",
      "label":"Email"
    },
    {
      "type": 'HorizontalLayout',
        "elements": [
          {
            "type": 'Control',
            "scope":"#/properties/telephone",
            "label": "Teléfono"
          },
          {
            "type": 'Control',
            "scope": '#/properties/identifier',
            "label":"DNI"
          }
        ]
    }
  ]
}

type Props = {
  isOpen: boolean
  place: PlaceType | null
  closePlaceFn: () => void
}
export default function SubmissionForm ({ isOpen, closePlaceFn, place }: Props) {
  const [data, setData] = useState({})
  const intl = useIntl()
  console.log('DATA', data)
  const onSubmit = async (closeFn: Function) => {
    console.log('Submit')
  }
  return (
    <Dialog
      onSubmit={onSubmit}
      isOpen={isOpen}
      title={place?.name}
      description={intl.formatMessage({
        defaultMessage: 'Selecciona las opciones más adecuadas para tí',
        id: 'CVLHyq'
      })}
      onClose={closePlaceFn}
      closeFn={closePlaceFn}
      footer={
        <>
          <Button
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
            onClick={closePlaceFn}
          >
            <FormattedMessage defaultMessage='Cancelar' id='nZLeaQ' />
          </Button>
        </>
      }
    >
      <JsonFormsStyleContext.Provider value={formStyles}>
        <JsonForms
          schema={jsonSchema}
          uischema={uiSchema}
          config={{
            hideRequiredAsterisk: true
          }}
          data={data}
          renderers={vanillaRenderers}
          cells={vanillaCells}
          onChange={({ data, errors }) => setData(data)}
        />
      </JsonFormsStyleContext.Provider>
    </Dialog>
  )
}
