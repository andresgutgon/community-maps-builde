import { useRef } from 'react'
import { useIntl } from 'react-intl'

import { FinancingRange, FINANCING_RANGES, FinancingState } from './useFilters'

const useBuildDescription = () => {
  const intl = useIntl()
  return ({ min, max }: FinancingRange): string => {
    return intl.formatMessage(
      { defaultMessage: 'De {min} a {max}% de aportación', id: 'OwIhLK' },
      { min, max: max - 1 }
    )
  }
}

type FinancingLabel = { title: string, description: string }
export type FinancingLabels = Record<FinancingState, FinancingLabel>
const useFinancingLabels = (): FinancingLabels => {
  const intl = useIntl()
  const buildDescription = useBuildDescription()
  return useRef<Record<FinancingState, FinancingLabel>>({
    [FinancingState.anyFinancingState]: {
      title: intl.formatMessage({ defaultMessage: 'Todos', id: 'P8VfZA' }),
      description: intl.formatMessage({ defaultMessage: 'Cualquier porcentaje de aportación', id: '9FzJdt' })
    },
    [FinancingState.starting]: {
      title: intl.formatMessage({ defaultMessage: 'Poco financiados', id: 'QK2a+D' }),
      description: buildDescription(FINANCING_RANGES[FinancingState.starting])
    },
    [FinancingState.middle]: {
      title: intl.formatMessage({ defaultMessage: 'Bastante financiados', id: 'gRQW59' }),
      description: buildDescription(FINANCING_RANGES[FinancingState.middle])
    },
    [FinancingState.finishing]: {
      title: intl.formatMessage({ defaultMessage: 'Casi financiados', id: '+xDksj' }),
      description: buildDescription(FINANCING_RANGES[FinancingState.finishing])
    },
    [FinancingState.completed]: {
      title: intl.formatMessage({ defaultMessage: 'Totalmente financiados', id: 'B2GImX' }),
      description: intl.formatMessage({ defaultMessage: 'Aportación al 100% completada', id: 'VVn4Nd' })
    }
  }).current
}

export default useFinancingLabels
