import { useState } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'

import type { Place } from '@maps/types/index'
import Button, { Size as ButtonSize, Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'

import SubmissionForm from '@maps/components/Place/SubmissionForm'

type PlaceContentProps = {
  isModalLoading: boolean,
  onClick: () => void,
  place: Place
}
const PlaceContent = ({ place, isModalLoading, onClick }: PlaceContentProps) => {
  const intl = useIntl()
  const { name, lat, lng } = place
  const button = intl.formatMessage({ id: 'IOnTHc', defaultMessage: 'Participar' })
  const buttonLoading = `${intl.formatMessage({ id: 'm9eXO9', defaultMessage: 'Cargando' })}...`
  const buttonLabel = isModalLoading ? buttonLoading : button
  return (
    <div className='flex flex-col space-y-4 p-3'>
      <pre className='whitespace-pre-wrap'>
        {`{ lat: '${lat}', lng: '${lng}', name: '${name}' }`}
      </pre>
      <div className='flex justify-end'>
        <Button
          disabled={isModalLoading}
          size={ButtonSize.sm}
          style={ButtonStyles.branded}
          onClick={onClick}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  )
}

type Props = { place: Place }
const PopupContent = ({ place }: Props) => {
  const [isOpen, setModal] = useState<boolean>(false)
  const [isModalLoading, setModalLoading] = useState<boolean>(false)
  const onClickOpen = () => {
    setModalLoading(true)
    setModal(true)
  }
  return (
    <>
      <PlaceContent
        place={place}
        onClick={onClickOpen}
        isModalLoading={isModalLoading}
      />
      {isOpen ? (
        <SubmissionForm
          isOpen={isOpen}
          closeFn={() => setModal(false)}
          onLoadingFinish={() => setModalLoading(false)}
          place={place}
        />
      ) : null}
    </>
  )
}

export default PopupContent
