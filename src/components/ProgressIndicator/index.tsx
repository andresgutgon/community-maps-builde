import cn from 'classnames'

type Props = { value: number; size: 'small' | 'normal' }
const ProgressIndicator = ({ value, size }: Props) => {
  return (
    <div className='w-full relative -bottom-2 pt-2 max-w-full'>
      <div
        className={cn(
          'bg-gray-600/20 w-full  top-[calc(-0.5rem-1px)] transition-colors relative rounded-full before:content-[""] before:absolute',
          {
            'h-3': size === 'normal',
            'h-1': size === 'small'
          }
        )}
      >
        <div
          className='bg-gray-800 h-full transition-colors rounded-inherit left-0 bottom-0 bg-opacity-70'
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressIndicator
