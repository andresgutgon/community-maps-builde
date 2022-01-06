import { useState } from 'react'

import { useMapData } from '@maps/components/CommunityProvider'
import { Step, SuggestReturnType } from '@maps/components/SuggestPlaceControl/useSuggest'
import type { GeocodingResult } from '@maps/components/SearchInput/geocoders'

import CategoryStep from './CategoryStep'
import AddressStep from './AddressStep'
import FormStep from './FormStep'

type Props = { suggest: SuggestReturnType }
const Steps = ({ suggest }: Props) => {
  const { categories } = useMapData()
  const [searchResult, setSearchResult] = useState<GeocodingResult>()
  const showCategory = suggest.step !== Step.address && categories.length > 1
  const showAddress = suggest.step !== Step.category
  const showForm = suggest.step === Step.form
  return (
    <>
      {showCategory ? (
        <CategoryStep suggest={suggest} />
      ) : null}
      {showAddress ? (
        <AddressStep
          suggest={suggest}
          searchResult={searchResult}
          setSearchResult={setSearchResult}
        />
      ) : null}
      {showForm ? (
        <FormStep suggest={suggest} />
      ) : null}
    </>
  )
}

export default Steps
