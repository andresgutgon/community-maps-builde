import { FormattedMessage } from 'react-intl'

import type { Place } from '@maps/types/index'
import Button, { Size as ButtonSize, Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'

type Props = { place: Place; openPlaceFn: () => void }
const PopupContent = ({ place, openPlaceFn }: Props) => {
  const { name, lat, lng } = place
  return (
    <div className='flex flex-col space-y-4 p-3'>
      <pre className='whitespace-pre-wrap'>
        {`{ lat: '${lat}', lng: '${lng}', name: '${name}' }`}
      </pre>
      <div className='flex justify-end'>
        <Button
          size={ButtonSize.sm}
          style={ButtonStyles.branded}
          onClick={openPlaceFn}
        >
          <FormattedMessage defaultMessage='Participar' id="IOnTHc" />
        </Button>
      </div>
    </div>
  )
}

export default PopupContent
