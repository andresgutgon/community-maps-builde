import { Marker, Popup } from 'react-leaflet'
import { useIntl, FormattedMessage } from 'react-intl'

import { useMapData } from '@maps/components/CommunityProvider'
import Button, { Size as ButtonSize, Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import type { Place as PlaceType } from '@maps/types/index'
import buildIcon from './buildIcon'

type Props = { place: PlaceType; openPlaceFn: () => void }
export default function Place ({ openPlaceFn, place }: Props) {
  const { config } = useMapData()
  const { name, lat, lng } = place
  const category = config.categories[place.category_slug]
  const latLng = { lat: parseFloat(lat), lng: parseFloat(lng) }
  const icon = buildIcon({ category })
  const intl = useIntl()
  return (
    <Marker position={latLng} icon={icon}>
      <Popup>
        <div className='text-red-700'>
          <pre className='whitespace-pre-wrap'>
            {`{ lat: '${lat}', lng: '${lng}', name: '${name}' }`}
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
