import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import cn from 'classnames'
import { useIntl, FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import { DragEndEvent, Map as LeafletMap } from 'leaflet'
import { Marker, useMap, TileLayer, MapContainer } from 'react-leaflet'

import { GeocoderService } from '@maps/types/index'
import useGeocoder from '@maps/components/SearchInput/useGeocoder'
import { useMapData } from '@maps/components/CommunityProvider'
import useTile from '@maps/components/CommunityProvider/useTile'
import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import type { GeocodingResult } from '@maps/components/SearchInput/geocoders'
import Fieldset from '@maps/components/Fieldset'
import Button, { Size as ButtonSize, Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import SearchInput from '@maps/components/SearchInput/InForm'
import SearchResult from '@maps/components/SearchResult'
import { Percentage } from '@maps/components/Marker'
import useMarkerIcon from '@maps/hooks/useMarkerIcon'
import { Step, SuggestReturnType } from '@maps/components/SuggestPlaceControl/useSuggest'

type Props = {
  suggest: SuggestReturnType
  searchResult: GeocodingResult
  setSearchResult: Dispatch<SetStateAction<GeocodingResult>>
  userKnowsAboutMapDragging: boolean
  setUserKnowsAboutMapDragging: Dispatch<SetStateAction<boolean>>
}
const GEOCODER_REVERSE_SCALE = 1
const AddressStep = ({
  suggest,
  searchResult,
  setSearchResult,
  userKnowsAboutMapDragging,
  setUserKnowsAboutMapDragging
}: Props) => {
  const { locale } = useRouter()
  const styles = useStyles()
  const [dragging, setDragging] = useState<boolean>(false)
  const intl = useIntl()
  const geocoder = useGeocoder({ service: GeocoderService.nominatim, locale })
  const { config, places } = useMapData()
  const tile = useTile(config)
  const icon = useMarkerIcon({ percentage: Percentage.full, slug: suggest?.category?.slug })
  const [map, setMap] = useState<LeafletMap | null>(null)
  const legend = intl.formatMessage({ defaultMessage: 'Dirección', id: 'Tq7tlV' })
  useEffect(() => {
    map?.fitBounds(searchResult.bbox)
  }, [map, searchResult])
  const onSearch = (result: GeocodingResult) => {
    setSearchResult(result)
    suggest.onAddressChange(
      {
        lat: result.center.lat,
        lng: result.center.lng
      },
      result.name
    )
  }

  if (!searchResult || suggest.step == Step.address) {
    return (
      <div className='space-y-2'>
        <div className='relative z-20'>
          <SearchInput locale={locale} onSearch={onSearch} />
        </div>
        {searchResult ? (
          <>
        <div
          className={
            cn(
              'relative z-0 p-4 border rounded flex items-center space-x-2 justify-between',
              {
                'border-gray-400': !dragging,
                'animate-pulse bg-green-300 border-green-700': dragging
              }
            )
          }>
              <SearchResult result={searchResult} />
            </div>
            {!userKnowsAboutMapDragging ? (
              <div className='flex flex-row space-x-4 my-2 bg-yellow-100 rounded p-4 text-yellow-800 text-xs'>
                <span className='text-3xl animate-bounce'>
                  👇&nbsp;
                </span>
                <FormattedMessage
                  id='Eek11u'
                  defaultMessage='Arrastra el punto si quieres ajustar la direccón. Si la ves bien pulsa continuar'
                />
              </div>
            ) : null}
            <MapContainer
              center={suggest.addressLatLng}
              zoom={13}
              className='relative z-0 w-full min-h-[300px] bg-gray-50 rounded overflow-hidden'
              whenCreated={setMap}
            >
              <Marker
                draggable
                icon={icon}
                position={suggest.addressLatLng}
                eventHandlers={{
                  dragstart: () => setDragging(true),
                  dragend: (event: DragEndEvent) => {
                    if (!userKnowsAboutMapDragging) {
                      setUserKnowsAboutMapDragging(true)
                    }
                    const latLng = event.target.getLatLng()
                    geocoder.reverse(
                      latLng,
                      GEOCODER_REVERSE_SCALE,
                      (results: GeocodingResult[]) => {
                        setDragging(false)
                        if (!results.length) return
                        onSearch(results[0])
                      }
                    )
                  }
                }}
              />
              <TileLayer {...tile} />
            </MapContainer>
          </>
        ) : null}
      </div>
    )
  }

  return (
      <Fieldset legend={legend}>
        <div className={styles.verticalLayout}>
          <div className='flex items-center space-x-2 justify-between'>
            <SearchResult result={searchResult} />
            <Button
              outline
              style={ButtonStyles.secondary}
              size={ButtonSize.sm}
              onClick={suggest.moveToStep(Step.address)}
            >
              <FormattedMessage defaultMessage='Cambiar direccón' id="DTelvK" />
            </Button>
          </div>
          <div className={styles.control}>
            <label htmlFor='addressAditionalInfo' className={styles.label}>
              <FormattedMessage id="Ib04NK" defaultMessage='Información adicional' />
            </label>
            <textarea
              className={styles.input}
              id='addressAditionalInfo'
              value={suggest.addressAditionalInfo}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                suggest.setAddressAditionalInfo(event.target.value)
              }}
            />
            <p className={styles.description}>
              <FormattedMessage id="E8dzwn" defaultMessage='Deja aquí cualquier aclaración relacionada con este lugar en lo relativo a su dirección o cualquier otro tema que nos quieras comentar' />
            </p>
          </div>
        </div>
      </Fieldset>
  )
}

export default AddressStep
