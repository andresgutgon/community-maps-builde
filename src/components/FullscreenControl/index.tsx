import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import screenfull from 'screenfull'

import ControlHandler from '@maps/components/ControlHandler'
import ReactControl from '@maps/components/ReactControl/index'

const FullscreenControl = () => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const intl = useIntl()
  const expandLabel = intl.formatMessage({
    id: 'lkLfmX',
    defaultMessage: 'Expandir mapa'
  })
  const contractLabel = intl.formatMessage({
    id: '/kG/Lg',
    defaultMessage: 'Minimizar mapa'
  })
  const onToggleFullscreen = useCallback(() => {
    if (expanded) {
      screenfull.exit()
    } else {
      screenfull.request(document.body)
    }
    setExpanded(!expanded)
  }, [expanded])
  useEffect(() => {
    try {
      screenfull.on('change', () => {
        setExpanded(!!document.fullscreenElement)
      })
    } catch (_e) {}
    return () => {
      try {
        screenfull?.off('change', onToggleFullscreen)
      } catch (_e) {}
    }
  }, [onToggleFullscreen])

  if (!screenfull || !screenfull.isEnabled) return null

  return (
    <ReactControl position='topleft'>
      <button onClick={onToggleFullscreen} className='w-full'>
        <ControlHandler
          icon={expanded ? 'fa-compress-arrows-alt' : 'fa-expand-arrows-alt'}
          label={expanded ? contractLabel : expandLabel}
        />
      </button>
    </ReactControl>
  )
}

export default FullscreenControl
