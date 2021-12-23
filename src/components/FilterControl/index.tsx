import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import cn from 'classnames'
import { useIntl } from 'react-intl'

import ReactControl from '@maps/components/ReactControl/index'

import { ActiveState } from './useFilters'
import FilterDisplay from './Display'

const FilterControl = () => {
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [Form, setForm] = useState(null)
  const onToggleFilters = () => {
    if (!Form) setLoading(true)
    setOpen(!open)
  }
  useEffect(() => {
    async function loadComponent () {
      if (!open || Form) return
      const Component = await dynamic(
        () => import('./Form'),
        { loading: () => (
          <div className='min-h-[100px] flex justify-center items-center'>
            `${intl.formatMessage({ id: 'm9eXO9', defaultMessage: 'Cargando' })}...`
          </div>
        )}
      )
      setForm(Component)
      setLoading(false)
    }
    loadComponent()
  }, [open, intl, loading, Form])

  // Initial Filter states
  // TODO: Pick from URL
  const [categorySlugs, setSelectedCategories] = useState<string[]>([])
  const [activeState, setState] = useState<ActiveState>(ActiveState.all)
  const [percentage, setPercentage] = useState<number>(0)

  const percentageLabel = intl.formatMessage(
    { id: 'VHf1xn', defaultMessage: '{percentage}% o más' }, { percentage }
  )
  return (
    <ReactControl
      position='topleft'
      className={
        cn(
          'transition-width',
          {
            'flex items-center justify-center': !open,
            'flex-col leaflet-expanded-control': open
          }
        )
      }
    >
      <FilterDisplay
        open={open}
        activeState={activeState}
        onToggleFilters={onToggleFilters}
        categorySlugs={categorySlugs}
        percentageLabel={percentageLabel}
        percentage={percentage}
      />
      {(Form && open) ? (
        <Form
          percentageLabel={percentageLabel}
          percentage={percentage}
          activeState={activeState}
          categorySlugs={categorySlugs}
          setSelectedCategories={setSelectedCategories}
          setPercentage={setPercentage}
          setState={setState}
          onToggleFilters={onToggleFilters}
        />
      ): null}
    </ReactControl>
  )
}

export default FilterControl
