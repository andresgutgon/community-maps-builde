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
export type CrowdfundingRange = { min: number; max: number }
export const DEFAULT_SHOW_FILTERS: ShowFilters = {
  status: true,
  crowdfunding: true,
  categories: true,
  customFilters: true
}
export const CROWDFOUNDING_RANGES: Partial<Record<State, CrowdfundingRange>> = {
  [State.starting]: { min: 0, max: 5 },
  [State.middle]: { min: 5, max: 75 },
  [State.finishing]: { min: 75, max: 101 }
}
export type Filters = { state: State; categories: string[]; custom: string[] }

function filterByCategory(categories: string[], showFilters: ShowFilters) {
  return (place: Place): boolean => {
    if (!showFilters?.categories) return true
    console.log('FILTER BY CATEGORY')
    console.log(categories)
    return categories.includes(place.category_slug)
  }
}

function filterByCustom(custom: string[], showFilters: ShowFilters) {
  return (place: Place): boolean => {
    if (!showFilters?.customFilters) return true
    console.log('FILTER BY CUSTOM')
    console.log(custom)
    console.log(place.filters)
    console.log(place.filters.includes(custom))
    const containsAll = custom.every((element) => {
      return place.filters.includes(element)
    })

    return containsAll
    // return custom.includes(place.category_slug)
  }
}

function filterByRange(state: State, showFilters: ShowFilters) {
  const range = CROWDFOUNDING_RANGES[state]
  return (place: Place): boolean => {
    if (!showFilters?.crowdfunding) return true

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
    filters: { state, categories, custom },
    showFilters
  }) => {
    console.log('HERE Are the places')
    console.log(places)
    const show = buildShowFilters(showFilters)
    const isAllState = State.all === state
    const isActive = State.active === state
    const showActiveFilter = show.status
    const categoriesFilterFn = filterByCategory(categories, show)
    const customFilterFn = filterByCustom(custom, show)
    const rangeFilterFn = filterByRange(state, show)
    return places.filter((place: Place) => {
      const included = categoriesFilterFn(place)
      const customIncluded = customFilterFn(place)
      const inRange = rangeFilterFn(place)

      console.log('INCLUDED')
      console.log(included)
      console.log('CUSTOM INCLUDED')
      console.log(customIncluded)

      if (isAllState) return included && customIncluded
      if (showActiveFilter && isActive)
        return included && customIncluded && place.active
      if (isActive) return included && customIncluded

      return included && customIncluded && inRange
    })
  }

  return { filterPlaces }
}

export default useFilters
