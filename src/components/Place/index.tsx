import { Marker, Popup } from 'react-leaflet'
import { useIntl, FormattedMessage } from 'react-intl'

import Button, { Size as ButtonSize, Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import type { Place as PlaceType } from '@maps/types/index'
import buildIcon from './buildIcon'

type Props = { place: PlaceType; openPlaceFn: () => void }
export default function Place ({ openPlaceFn, place }: Props) {
  const { name, lat, long, categoryType } = place
  const latLong = { lat: parseFloat(lat), lng: parseFloat(long) }
  const icon = buildIcon({ category: categoryType })
  const intl = useIntl()
  return (
    <Marker position={latLong} icon={icon}>
      <Popup>
        <div className='text-red-700'>
          <pre className='whitespace-pre-wrap'>
            {`{ lat: '${lat}', long: '${long}', name: '${name}' }`}
          </pre>
          <Button
            size={ButtonSize.sm}
            fullWidth
            style={ButtonStyles.branded}
            onClick={openPlaceFn}
          >
            <FormattedMessage defaultMessage='Participar' id="IOnTHc" />
          </Button>
        </div>
      </Popup>
    </Marker>
  )
}
