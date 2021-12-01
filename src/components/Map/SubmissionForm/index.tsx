import { useMemo, SyntheticEvent } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'

import Button, { Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import Dialog from '@maps/components/Dialog'
import type { Place as PlaceType } from '@maps/types/index'

type Props = {
  isOpen: boolean
  place: PlaceType | null
  closePlaceFn: () => void
}
export default function SubmissionForm ({ isOpen, closePlaceFn, place }: Props) {
  const intl = useIntl()
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
     Form Content here
    </Dialog>
  )
}
