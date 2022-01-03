import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import dynamic from 'next/dynamic'
import screenfull from 'screenfull'

import { useMapData } from '@maps/components/CommunityProvider'
import Button, { Size as ButtonSize, Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import ControlHandler from '@maps/components/ControlHandler'
import ReactControl from '@maps/components/ReactControl/index'
import SubmissionDialog from './SubmissionDialog'

const SuggestPlaceControl = () => {
  const { config } = useMapData()
  const [isOpen, setModal] = useState<boolean>(false)
  const [isModalLoading, setModalLoading] = useState<boolean>(false)
  const onClickOpen = () => {
    setModalLoading(true)
    setModal(true)
  }
  const forms = config.suggestPlaceForms || {}

  if (!Object.keys(forms).length) return null

  return (
    <ReactControl position='topleft'>
      <ControlHandler
        icon='fa-map-marker-alt'
        label={
          <Button
            onClick={onClickOpen}
            disabled={isModalLoading}
            size={ButtonSize.sm}
            type={ButtonType.button}
            style={ButtonStyles.branded}
          >
            {isModalLoading ? (
              <><FormattedMessage defaultMessage='Cargando' id="m9eXO9" />{'...'}</>
            ) : (
              <FormattedMessage defaultMessage='Sugiérenos un lugar' id="kUKcmK" />
            )}
          </Button>
        }
      />
      <SubmissionDialog
        isOpen={isOpen}
        closeFn={() => setModal(false)}
        onLoadingFinish={() => setModalLoading(false)}
      />
    </ReactControl>
  )
}

export default SuggestPlaceControl
