import cn from 'classnames'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import { Color } from '@maps/components/Marker'
import { FinancingState } from '../useFilters'
import useFinancingLabels from '../useFinancingLabels'

export const FINANCING_STATE_COLORS: Partial<Record<FinancingState, Color>> = {
  [FinancingState.anyFinancingState]: { textColor: 'text-gray-300', bg: 'bg-white', border: 'border-gray-800/20' },
  [FinancingState.starting]: { textColor: 'text-blue-900/50', bg: 'bg-blue-100', border: 'border-blue-900/60' },
  [FinancingState.middle]: { textColor: 'text-blue-900/50', bg: 'bg-blue-300', border: 'border-blue-900/60' },
  [FinancingState.finishing]: { textColor: 'text-blue-200', bg: 'bg-blue-500', border: 'border-blue-900/60' },
  [FinancingState.completed]: { textColor: 'text-blue-200/80', bg: 'bg-blue-800', border: 'border-white/50' }
}

type Props = {
  showDescription: boolean
  financingLabelsfinancingState: FinancingState
}
const FinancingLabel = ({ showDescription = false, financingState }) => {
  const styles = useStyles()
  const financingLabels = useFinancingLabels()
  const { bg, border } = FINANCING_STATE_COLORS[financingState]
  return (
    <div className='flex md:items-center'>
      <div className={cn('flex-none mt-1 sm:mt-0 h-6 w-6 border-2 rounded-md p-2', bg, border)} />
      <div
        className={
          cn(
            'flex-0 flex sm:flex-col ml-2',
            {
              'flex-row items-center sm:items-start': !showDescription,
              'flex-col items-start': showDescription
            }
          )
        }
      >
        <div className={cn(styles.radio.label, 'font-medium')}>
          {financingLabels[financingState].title}
        </div>
        <span
          className={
            cn(
              'text-xs text-gray-500',
              {
                'hidden sm:block': !showDescription
              }
            )
          }
        >
          {financingLabels[financingState].description}
        </span>
      </div>
    </div>
  )
}

export default FinancingLabel
