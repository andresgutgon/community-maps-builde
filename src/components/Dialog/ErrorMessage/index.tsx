import { useEffect, useRef } from 'react'
import { XCircleIcon } from '@heroicons/react/outline'

type Props = { message: string }
const ErrorMessage = ({ message }: Props) => {
  const ref = useRef<HTMLDivElement>()
  useEffect(() => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])
  return (
    <div className='relative bg-red-600 rounded'>
      <div ref={ref} className='absolute -top-28' />
      <div className='space-x-2 flex p-2'>
        <XCircleIcon className="h-6 w-6 text-red-50" aria-hidden="true" />
        <div className='text-red-50'>{message}</div>
      </div>
    </div>
  )
}

export default ErrorMessage
