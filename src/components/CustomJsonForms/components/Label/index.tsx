import { ReactNode } from 'react'
import cn from 'classnames'
import { ErrorObject } from 'ajv'
import { computeLabel, ControlElement } from '@jsonforms/core'

const FORCE_FOCUS_TO_SHOW_DESCRIPTION = true
type Props = {
  id: string
  uischema: ControlElement
  required: boolean
  label: string
  className: string
  rightValue?: string | ReactNode
}
const Label = ({ id, label, required, className, uischema, rightValue }: Props) => {
  const hideRequiredAsterisk = uischema?.options?.hideRequiredAsterisk
  return (
    <label htmlFor={id + '-input'} className={className}>
      {computeLabel(
        label,
        required,
        hideRequiredAsterisk
      )}
      {rightValue ? (
        <div className='text-2xl font-medium'>{rightValue}</div>
      ) : null}
    </label>
  )
}

export default Label
