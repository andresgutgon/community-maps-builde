import { Dispatch, SetStateAction, useState } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'

import type { GeocodingResult } from '@maps/components/SearchInput/geocoders'
import Fieldset from '@maps/components/Fieldset'
import Button, { Size as ButtonSize, Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import SearchInput from '@maps/components/SearchInput/InForm'
import SearchResult from '@maps/components/SearchResult'
import { Step, SuggestReturnType } from '@maps/components/SuggestPlaceControl/useSuggest'

type Props = {
  suggest: SuggestReturnType
  searchResult: GeocodingResult
  setSearchResult: Dispatch<SetStateAction<GeocodingResult>>
}
const AddressStep = ({ suggest, searchResult, setSearchResult }: Props) => {
  const intl = useIntl()
  const { locale } = useRouter()
  const legend = intl.formatMessage({ defaultMessage: 'Dirección', id: 'Tq7tlV' })
  const onSearch = (result: GeocodingResult) => {
    setSearchResult(result)
  }
  const onConfirmAddress = () => {
    suggest.onAddressChange({
      latitude: searchResult.center.lat.toString(),
      longitude: searchResult.center.lng.toString(),
      address: searchResult.name
    })
  }

  if (!searchResult || suggest.step == Step.address) {
    return (
      <div className='space-y-2'>
        <SearchInput locale={locale} onSearch={onSearch} />
        {searchResult ? (
          <div className='p-4 border border-gray-400 rounded flex items-center space-x-2 justify-between'>
            <SearchResult result={searchResult} />
            <div className='flex items-center space-x-2'>
              <Button
                outline
                style={ButtonStyles.secondary}
                size={ButtonSize.sm}
                onClick={onConfirmAddress}
              >
                <FormattedMessage defaultMessage='Confirmar' id="+/MNWw" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  return (
      <Fieldset legend={legend}>
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
      </Fieldset>
  )
}

export default AddressStep
