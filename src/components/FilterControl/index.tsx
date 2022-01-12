import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import cn from 'classnames'
import { useIntl } from 'react-intl'
import { useMapEvents } from 'react-leaflet'

import { useMapData } from '@maps/components/CommunityProvider'
import ReactControl from '@maps/components/ReactControl/index'
import LoadingCode from '@maps/components/LoadingCode'

import { useShowFiltersWithDefaults, State } from './useFilters'
import FilterDisplay from './Display'

const FilterControl = () => {
  const intl = useIntl()
  const { allPlaces, urlParams: { filters }, config } = useMapData()
  const showFilters = useShowFiltersWithDefaults(config.showFilters)
  const unfilteredCrowdfoundingStates = useRef<State[]>([
    State.starting,
    State.middle,
    State.finishing,
  ]).current
  const crowdfoundingStates = useRef<State[]>(showFilters.crowdfounding
    ? unfilteredCrowdfoundingStates : []
  ).current
  const statusStates = useRef<State[]>(showFilters.status ? [State.active] : []).current
  const states = useRef<State[]>([
    State.all,
    ...crowdfoundingStates,
    ...statusStates
  ]).current
  const showAnyFilter = showFilters.status || showFilters.crowdfounding || showFilters.categories
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [Form, setForm] = useState(null)
  const onToggleFilters = () => {
    if (!Form) setLoading(true)
    setOpen(!open)
  }
  const [categorySlugs, setSelectedCategories] = useState<string[]>(filters.categories)
  const [state, setState] = useState<State>(filters.state)
  const closeFilter = () => setOpen(false)
  useMapEvents({ click: closeFilter, mousedown: closeFilter })
  useEffect(() => {
    async function loadComponent () {
      if (!showAnyFilter || !open || Form) return
      const Component = await dynamic(
        () => import('./Form'),
        { loading: () => <LoadingCode />}
      )
      setForm(Component)
      setLoading(false)
    }
    loadComponent()
  }, [open, intl, loading, Form, showAnyFilter])

  if (!showAnyFilter) return null

  return (
    <ReactControl
      position='topleft'
      className={
        cn(
          'transition-width',
          {
            'hidden': !allPlaces.length,
            'flex items-center justify-center': !open,
            'flex-col leaflet-expanded-control bg-gray-50': open
          }
        )
      }
    >
      <FilterDisplay
        open={open}
        state={state}
        statusStates={statusStates}
        unfilteredCrowdfoundingStates={unfilteredCrowdfoundingStates}
        crowdfoundingStates={crowdfoundingStates}
        onToggleFilters={onToggleFilters}
        categorySlugs={categorySlugs}
      />
      {(Form && open) ? (
        <Form
          currentState={state}
          states={states}
          setState={setState}
          categorySlugs={categorySlugs}
          setSelectedCategories={setSelectedCategories}
          onToggleFilters={onToggleFilters}
        />
      ): null}
    </ReactControl>
  )
}

export default FilterControl
