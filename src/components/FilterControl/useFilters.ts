import { useRef } from 'react'
import { Place } from '@maps/types/index'

import { ShowFilters } from '@maps/types/index'

export enum State {
  all = 'all',
  starting = 'starting',
  middle = 'middle',
  finishing = 'finishing',
  active = 'active'
}
export type CrowdfoundingRange = { min: number; max: number }
export const DEFAULT_SHOW_FILTERS: ShowFilters = {
  status: true,
  crowdfounding: true,
  categories: true
}
export const CROWDFOUNDING_RANGES: Partial<Record<State, CrowdfoundingRange>> =
  {
    [State.starting]: { min: 0, max: 5 },
    [State.middle]: { min: 5, max: 75 },
    [State.finishing]: { min: 75, max: 100 }
  }
export type Filters = { state: State; categories: string[] }

function filterByCategory(categories: string[], showFilters: ShowFilters) {
  return (place: Place): boolean => {
    if (!showFilters?.categories) return true

    return categories.includes(place.category_slug)
  }
}

function filterByRange(state: State, showFilters: ShowFilters) {
  const range = CROWDFOUNDING_RANGES[state]
  return (place: Place): boolean => {
    if (!showFilters?.crowdfounding) return true

    // Exclude active places from range
    if (place.active) return false

    const percentage = place.goalProgress
    return percentage >= range?.min && percentage < range?.max
  }
}

const buildShowFilters = (showFilters: ShowFilters): ShowFilters => ({
  ...DEFAULT_SHOW_FILTERS,
  ...(showFilters || {})
})
export const useShowFiltersWithDefaults = (
  showFilters: ShowFilters
): ShowFilters => useRef<ShowFilters>(buildShowFilters(showFilters)).current

type FilterFnProps = {
  places: Place[]
  filters: Filters
  showFilters: ShowFilters
}
export type FilterFn = ({ places, filters }: FilterFnProps) => Place[]
type ReturnType = { filterPlaces: FilterFn }
const useFilters = (): ReturnType => {
  const filterPlaces: FilterFn = ({
    places,
    filters: { state, categories },
    showFilters
  }) => {
    const show = buildShowFilters(showFilters)
    const isAllState = State.all === state
    const isActive = State.active === state
    const showActiveFilter = show.status
    const categoriesFilterFn = filterByCategory(categories, show)
    const rangeFilterFn = filterByRange(state, show)
    return places.filter((place: Place) => {
      const included = categoriesFilterFn(place)
      const inRange = rangeFilterFn(place)

      if (isAllState) return included
      if (showActiveFilter && isActive) return included && place.active
      if (isActive) return included

      return included && inRange
    })
  }

  return { filterPlaces }
}

export default useFilters
