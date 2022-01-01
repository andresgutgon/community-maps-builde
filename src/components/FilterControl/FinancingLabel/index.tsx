import cn from 'classnames'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import { FinancingState } from '../useFilters'
import useFinancingLabels from '../useFinancingLabels'
import { Percentage } from '@maps/components/Marker'

const PERCENTAGES: Partial<Record<FinancingState, Percentage>> = {
  [FinancingState.starting]: Percentage.thirty,
  [FinancingState.middle]: Percentage.fifty,
  [FinancingState.finishing]: Percentage.seventy,
  [FinancingState.completed]: Percentage.full
}

type Props = {
  showDescription: boolean
  financingLabelsfinancingState: FinancingState
}
const FinancingLabel = ({ showDescription = false, financingState }) => {
  const percentage = PERCENTAGES[financingState] || 0
  const styles = useStyles()
  const financingLabels = useFinancingLabels()
  const { bg, border } = {
    bg: 'bg-gray-100',
    border: 'border-gray-800'
  }
  return (
    <div className='flex md:items-center'>
      <div className='overflow-hidden relative flex-none mt-1 sm:mt-0 h-8 w-8 border border-gray-700 rounded-full p-2'>
        <div className= 'z-0 rounded-full absolute inset-0 bg-opacity-10 bg-gray-700' />
        <div
          style={{ height: `${percentage}%` }}
          className='z-10 absolute left-0 right-0 bottom-0 bg-gray-600'
        />
      </div>
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
