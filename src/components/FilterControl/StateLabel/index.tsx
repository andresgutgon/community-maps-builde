import cn from 'classnames'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import { State } from '../useFilters'
import useStateLabels from '../useStateLabels'
import { Percentage } from '@maps/components/Marker'

const PERCENTAGES: Partial<Record<State, Percentage>> = {
  [State.starting]: Percentage.thirty,
  [State.middle]: Percentage.fifty,
  [State.finishing]: Percentage.seventy,
  [State.active]: Percentage.full,
}

type Props = { showDescription: boolean; state: State }
const StateLabel = ({ showDescription = false, state }: Props) => {
  const styles = useStyles()
  const labels = useStateLabels()
  const percentage = PERCENTAGES[state] || 0
  return (
    <div className='flex md:items-center'>
      <div
        className={cn(
          'overflow-hidden relative flex-none mt-1 sm:mt-0 border border-gray-700 rounded-full p-2',
          'h-6 w-6 xs:h-8 xs:w-8'
        )}
      >
        <div className='z-0 rounded-full absolute inset-0 bg-opacity-10 bg-gray-700' />
        <div
          style={{ height: `${percentage}%` }}
          className='z-10 absolute left-0 right-0 bottom-0 bg-gray-600'
        />
      </div>
      <div
        className={cn('flex-0 flex sm:flex-col ml-2', {
          'flex-row items-center sm:items-start': !showDescription,
          'flex-col items-start': showDescription,
        })}
      >
        <div
          className={cn(styles.radio.label, {
            'font-medium': showDescription,
            'sm:font-medium': !showDescription,
            'text-xs sm:text-sm': !showDescription,
          })}
        >
          {labels[state].title}
        </div>
        <span
          className={cn('text-xs text-gray-500', {
            'hidden sm:block': !showDescription,
          })}
        >
          {labels[state].description}
        </span>
      </div>
    </div>
  )
}

export default StateLabel
