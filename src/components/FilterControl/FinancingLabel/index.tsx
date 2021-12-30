import cn from 'classnames'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import { FinancingState } from '../useFilters'
import useFinancingLabels from '../useFinancingLabels'

type Props = {
  showDescription: boolean
  financingLabelsfinancingState: FinancingState
}
const FinancingLabel = ({ showDescription = false, financingState }) => {
  const styles = useStyles()
  const financingLabels = useFinancingLabels()
  return (
    <div className='flex md:items-center'>
      <div
        className={
          cn(
            'flex-none mt-1 sm:mt-0 h-6 w-6 border-2 rounded-md p-2',
            {
              'bg-white border-gray-800': financingState === FinancingState.anyFinancingState,
              'border-transparent': financingState !== FinancingState.anyFinancingState,
              'bg-green-200': financingState === FinancingState.starting,
              'bg-green-400': financingState === FinancingState.middle,
              'bg-green-600': financingState === FinancingState.finishing,
              'bg-green-800': financingState === FinancingState.completed
            }
          )
        }
      />
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
