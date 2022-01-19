import { useEffect, useRef } from 'react'
import { XCircleIcon } from '@heroicons/react/outline'

type Props = { message: string; show: boolean }
const ErrorMessage = ({ show, message }: Props) => {
  const ref = useRef<HTMLDivElement>()
  const forceScrollOnRender = +new Date()
  useEffect(() => {
    if (!ref?.current) return
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [forceScrollOnRender])

  if (!show) return null

  return (
    <div className='relative bg-red-600 rounded'>
      <div ref={ref} className='absolute -top-28' />
      <div className='space-x-2 flex p-2'>
        <XCircleIcon className='h-6 w-6 text-red-50' aria-hidden='true' />
        <div className='text-red-50'>{message}</div>
      </div>
    </div>
  )
}

export default ErrorMessage
