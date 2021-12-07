import { ReactNode } from 'react'
import cn from 'classnames'
import { ErrorObject } from 'ajv'
import { computeLabel, ControlElement } from '@jsonforms/core'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'

const FORCE_FOCUS_TO_SHOW_DESCRIPTION = true
type Props = {
  id: string,
  uischema: ControlElement,
  required: boolean,
  label: string,
  classNames: { [className: string]: string },
  rightValue?: string | ReactNode
}
const Label = ({ id, label, required, classNames, uischema, rightValue }: Props) => {
  const hideRequiredAsterisk = uischema?.options?.hideRequiredAsterisk
  return (
    <label htmlFor={id + '-input'} className={classNames.label}>
      {computeLabel(
        label,
        required,
        hideRequiredAsterisk
      )}
      {rightValue ? (
        <div className='text-base font-medium'>{rightValue}</div>
      ) : null}
    </label>
  )
}

export default Label
