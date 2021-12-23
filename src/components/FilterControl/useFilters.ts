import { Place } from '@maps/types/index'

export enum ActiveState { all = 'all', active = 'active', inactive = 'inactive' }

export type Filters = {
  categories: string[]
  activeState: ActiveState
  percentage: number
}
type FilterFn = (allPlaces: Place[], filters: Filters) => Place[]
type ReturnType = { filter: FilterFn }
const useFilters = () => {
  const filter: FilterFn = (allPlaces: Place[], { categories, percentage, activeState }: Filters) => {
    const anyState = ActiveState.all === activeState
    return allPlaces.filter((place: Place) => {
      const placeState = place.active ? ActiveState.active : ActiveState.inactive
      return categories.includes(place.category_slug)
        && (!percentage ? true : percentage <= place.goalProgress)
        && (anyState ? true : activeState === placeState)
    })
  }

  return { filter }
}

export default useFilters
