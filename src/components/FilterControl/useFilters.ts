import { Place } from '@maps/types/index'

export enum ActiveState { all = 'all', active = 'active', inactive = 'inactive' }

export enum FinancingState {
  anyFinancingState = 'anyFinancingState',
  starting = 'starting',
  middle = 'middle',
  finishing = 'finishing',
  completed = 'completed'
}
export type FinancingRange = { min: number, max: number }
export const FINANCING_RANGES: Partial<Record<FinancingState, FinancingRange>> = {
  [FinancingState.starting]: { min: 0, max: 5 },
  [FinancingState.middle]: { min: 5, max: 75 },
  [FinancingState.finishing]: { min: 75, max: 100 },
  [FinancingState.completed]: { min: 100, max: 100 }
}

export const useFindFinantialStateByRange = (percentage: number): FinancingState => {
  if (percentage < FINANCING_RANGES.starting.max) {
    return FinancingState.starting
  } else if (percentage < FINANCING_RANGES.middle.max){
    return FinancingState.middle
  } else if (percentage < FINANCING_RANGES.finishing.max){
    return FinancingState.finishing
  }
  return FinancingState.completed
}

export type Filters = {
  activeState: ActiveState
  financingState: FinancingState
  categories: string[]
}
type FilterFn = (allPlaces: Place[], filters: Filters) => Place[]
type ReturnType = { filter: FilterFn }
const useFilters = () => {
  const filter: FilterFn = (allPlaces: Place[], { activeState, financingState, categories }: Filters) => {
    const anyActiveState = ActiveState.all === activeState
    const isActive = ActiveState.active === activeState
    const range = FINANCING_RANGES[financingState]
    const anyFinancingState = isActive || FinancingState.anyFinancingState === financingState
    return allPlaces.filter((place: Place) => {
      const placeState = place.active ? ActiveState.active : ActiveState.inactive
      const percentage = place.goalProgress
      const categoryIncluded = categories.includes(place.category_slug)
      return (
        anyActiveState ? true : activeState === placeState
      )
        && (
          anyFinancingState
            ? true
            : (!!range && range.min === range.max)
              ? percentage >= range.min
              : percentage >= range.min && percentage < range.max
        )
        && categoryIncluded
    })
  }

  return { filter }
}

export default useFilters
