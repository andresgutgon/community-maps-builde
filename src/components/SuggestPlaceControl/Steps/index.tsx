import { useState } from 'react'

import { useMapData } from '@maps/components/CommunityProvider'
import { Step, SuggestReturnType } from '@maps/components/SuggestPlaceControl/useSuggest'
import type { GeocodingResult } from '@maps/components/SearchInput/geocoders'
import { useErrorMessage } from '@maps/components/CustomJsonForms/hooks/useErrorMessage'
import LegalCheck from '@maps/components/LegalCheck'

import CategoryStep from './CategoryStep'
import AddressStep from './AddressStep'
import FormStep from './FormStep'

type Props = { suggest: SuggestReturnType }
const Steps = ({ suggest }: Props) => {
  const { categories } = useMapData()
  const [userKnowsAboutMapDragging, setUserKnowsAboutMapDragging] = useState<boolean>(false)
  const [searchResult, setSearchResult] = useState<GeocodingResult>(null)
  const showCategory = suggest.step !== Step.address && categories.length > 1
  const showAddress = suggest.step !== Step.category
  const showForm = suggest.step === Step.form
  const responseOk = suggest?.form?.response?.ok
  const error = useErrorMessage({ form: suggest.form })
  return (
    <>
      {showForm ? <FormStep suggest={suggest} /> : null}
      {(!responseOk && showCategory) ?  <CategoryStep suggest={suggest} /> : null}
      {(!responseOk && showAddress) ? (
        <AddressStep
          suggest={suggest}
          searchResult={searchResult}
          setSearchResult={setSearchResult}
          userKnowsAboutMapDragging={userKnowsAboutMapDragging}
          setUserKnowsAboutMapDragging={setUserKnowsAboutMapDragging}
        />
      ) : null}
      {(showForm && !responseOk) ? (
        <LegalCheck
          error={error.message}
          checked={suggest.legalTermsAccepted}
          onCheck={(accepted: boolean) => suggest.setLegalTermsAccepted(accepted)}
        />
      ) : null}
    </>
  )
}

export default Steps
