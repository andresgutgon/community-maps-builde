import { ReactNode } from 'react'
import { computeLabel, ControlElement } from '@jsonforms/core'

type Props = {
  id: string
  uischema: ControlElement
  required: boolean
  label: string
  className: string
  rightValue?: string | ReactNode
}
const Label = ({
  id,
  label,
  required,
  className,
  uischema,
  rightValue
}: Props) => {
  const hideRequiredAsterisk = uischema?.options?.hideRequiredAsterisk
  return (
    <label htmlFor={id + '-input'} className={className}>
      {computeLabel(label, required, hideRequiredAsterisk)}
      {rightValue ? (
        <div className='text-2xl font-medium'>{rightValue}</div>
      ) : null}
    </label>
  )
}

export default Label
