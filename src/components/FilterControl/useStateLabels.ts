import { useRef } from 'react'
import { useIntl } from 'react-intl'

import { CrowdfundingRange, CROWDFOUNDING_RANGES, State } from './useFilters'

const useBuildDescription = () => {
  const intl = useIntl()
  return ({ min, max }: CrowdfundingRange): string => {
    return intl.formatMessage(
      { defaultMessage: 'De {min} a {max}% de aportación', id: 'OwIhLK' },
      { min, max: max - 1 }
    )
  }
}

type StateLabel = { title: string; description: string }
type Labels = Record<State, StateLabel>
const useStateLabels = (): Labels => {
  const intl = useIntl()
  const buildDescription = useBuildDescription()
  return useRef<Record<State, StateLabel>>({
    [State.all]: {
      title: intl.formatMessage({ defaultMessage: 'Todos', id: 'P8VfZA' }),
      description: intl.formatMessage({
        defaultMessage: 'Todos los lugares sin filtrar',
        id: 'VvIgYE'
      })
    },
    [State.starting]: {
      title: intl.formatMessage({
        defaultMessage: 'Poco financiados',
        id: 'QK2a+D'
      }),
      description: buildDescription(CROWDFOUNDING_RANGES[State.starting])
    },
    [State.middle]: {
      title: intl.formatMessage({
        defaultMessage: 'Bastante financiados',
        id: 'gRQW59'
      }),
      description: buildDescription(CROWDFOUNDING_RANGES[State.middle])
    },
    [State.finishing]: {
      title: intl.formatMessage({
        defaultMessage: 'Casi financiados',
        id: '+xDksj'
      }),
      description: buildDescription(CROWDFOUNDING_RANGES[State.finishing])
    },
    [State.active]: {
      title: intl.formatMessage({ defaultMessage: 'Activos', id: 'GbLpqH' }),
      description: intl.formatMessage({
        defaultMessage: 'Estos puntos están funcionando',
        id: 'J3iaDf'
      })
    }
  }).current
}

export default useStateLabels
