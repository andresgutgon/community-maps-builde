import { useRef } from 'react'
import { Place } from '@maps/types/index'

import { ShowFilters } from '@maps/types/index'
import { Percentage } from '@maps/components/Marker'

export enum State {
  all = 'all',
  starting = 'starting',
  middle = 'middle',
  finishing = 'finishing',
  active = 'active'
}
export type CrowdfoundingRange = { min: number, max: number }
export const DEFAULT_SHOW_FILTERS: ShowFilters = {
  status: true, crowdfounding: true, categories: true
}
export const CROWDFOUNDING_RANGES: Partial<Record<State, CrowdfoundingRange>> = {
  [State.starting]: { min: 0, max: 5 },
  [State.middle]: { min: 5, max: 75 },
  [State.finishing]: { min: 75, max: 100 }
}
export type Filters = { state: State; categories: string[] }

function filterByCategory (categories: string[], showFilters: ShowFilters) {
  return (place): boolean => {
    if (!showFilters?.categories) return true

    return categories.includes(place.category_slug)
  }
}

function filterByRange (state: State, showFilters: ShowFilters) {
  const range = CROWDFOUNDING_RANGES[state]
  return (place: Place): boolean => {
    if (!showFilters?.crowdfounding) return true

    // Exclude active places from range
    if (place.active) return false

    const percentage = place.goalProgress
    return percentage >= range?.min && percentage < range?.max
  }
}

function filterByState (state: State, showFilters: ShowFilters) {
  const isActive = State.active === state
  return (place: Place): boolean => {
    if (!showFilters?.status && isActive) return true

    return isActive && place.active
  }
}

const buildShowFilters = (showFilters: ShowFilters): ShowFilters =>
  ({ ...DEFAULT_SHOW_FILTERS, ...(showFilters || {})})
export const useShowFiltersWithDefaults = (showFilters: ShowFilters): ShowFilters =>
  useRef<ShowFilters>(buildShowFilters(showFilters)).current

type FilterFnProps = { places: Place[], filters: Filters, showFilters: ShowFilters }
type FilterFn = ({ places, filters }: FilterFnProps) => Place[]
type ReturnType = { filterPlaces: FilterFn }
const useFilters = (): ReturnType  => {
  const filterPlaces: FilterFn = ({ places, filters: { state, categories }, showFilters }) => {
    const show = buildShowFilters(showFilters)
    const isAllState = State.all === state
    const categoriesFilterFn = filterByCategory(categories, show)
    const rangeFilterFn = filterByRange(state, show)
    const stateFilterFn = filterByState(state, show)
    return places.filter((place: Place) => {
      const isActiveState = stateFilterFn(place)
      const included = categoriesFilterFn(place)
      const inRange = rangeFilterFn(place)

      if (isActiveState || isAllState) return included

      return included && inRange
    })
  }

  return { filterPlaces }
}

export default useFilters
