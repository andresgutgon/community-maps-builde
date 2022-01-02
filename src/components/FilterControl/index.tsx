import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import cn from 'classnames'
import { useIntl } from 'react-intl'
import { useMapEvents } from 'react-leaflet'

import { useMapData } from '@maps/components/CommunityProvider'
import ReactControl from '@maps/components/ReactControl/index'

import { FINANCING_RANGES, FinancingState, ActiveState } from './useFilters'
import FilterDisplay from './Display'

const FilterControl = () => {
  const intl = useIntl()
  const { allPlaces, urlParams: { filters } } = useMapData()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [Form, setForm] = useState(null)
  const onToggleFilters = () => {
    if (!Form) setLoading(true)
    setOpen(!open)
  }
  const [categorySlugs, setSelectedCategories] = useState<string[]>(filters.categories)
  const [activeState, setActiveState] = useState<ActiveState>(filters.activeState)
  const [financingState, setFinancingState] = useState<FinancingState>(filters.financingState)
  const closeFilter = () => setOpen(false)
  useMapEvents({ click: closeFilter, mousedown: closeFilter })
  useEffect(() => {
    async function loadComponent () {
      if (!open || Form) return
      const Component = await dynamic(
        () => import('./Form'),
        { loading: () => (
          <div className='min-h-[100px] flex justify-center items-center'>
            {intl.formatMessage({ id: 'm9eXO9', defaultMessage: 'Cargando' })}...
          </div>
        )}
      )
      setForm(Component)
      setLoading(false)
    }
    loadComponent()
  }, [open, intl, loading, Form])
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
        activeState={activeState}
        financingState={financingState}
        onToggleFilters={onToggleFilters}
        categorySlugs={categorySlugs}
      />
      {(Form && open) ? (
        <Form
          activeState={activeState}
          financingState={financingState}
          categorySlugs={categorySlugs}
          setSelectedCategories={setSelectedCategories}
          setFinancingState={setFinancingState}
          setActiveState={setActiveState}
          onToggleFilters={onToggleFilters}
        />
      ): null}
    </ReactControl>
  )
}

export default FilterControl
