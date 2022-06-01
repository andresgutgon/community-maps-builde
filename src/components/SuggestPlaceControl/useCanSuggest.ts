import { useMapData } from '@maps/components/CommunityProvider'
// At least you need to define a key in config called
// `suggestPlaceForms` and inside a form with the key: `suggest_place_generic`
const useCanSuggest = (): boolean => {
  const {
    config: { hasProposal }
  } = useMapData()
  return hasProposal
}

export default useCanSuggest
