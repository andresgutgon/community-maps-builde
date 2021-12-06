import { ChangeEvent } from 'react'
import merge from 'lodash/merge'
import {
  rankWith,
  RankedTester,
  uiTypeIs,
  and,
  optionIs,
  isEnumControl,
  OwnPropsOfEnum,
  ControlProps,
  isDescriptionHidden,
  computeLabel
} from '@jsonforms/core'
import { withJsonFormsEnumProps } from '@jsonforms/react'
import { withVanillaControlProps, VanillaRendererProps } from '@jsonforms/vanilla-renderers'
import { buildScope } from '../index'

export const radioGroupTester: RankedTester = rankWith(
  10, //increase rank as needed
  and(isEnumControl, optionIs('format', buildScope('radio')))
)

const FORCE_FOCUS_TO_SHOW_DESCRIPTION = true
type Props = ControlProps & VanillaRendererProps & OwnPropsOfEnum
const Renderer = ({
  classNames,
  id,
  label,
  options,
  required,
  description,
  errors,
  data,
  uischema,
  visible,
  config,
  path,
  handleChange,
  enabled
}: Props) => {
  const isValid = errors.length === 0
  const divClassNames = `validation  ${isValid ? classNames.description : 'validation_error'}`
  const appliedUiSchemaOptions = merge({}, config, uischema.options)
  const showDescription = !isDescriptionHidden(
    visible,
    description,
    FORCE_FOCUS_TO_SHOW_DESCRIPTION,
    appliedUiSchemaOptions.showUnfocusedDescription
  )
  return (
    <div className={classNames.wrapper} hidden={!visible}>
      <label htmlFor={id} className={classNames.label}>
        {computeLabel(
          label,
          required,
          appliedUiSchemaOptions.hideRequiredAsterisk
        )}
      </label>

    <div>
      {options.map(option => (
      <div key={option.label}>
        <input
          type='radio'
          value={option.value}
          id={option.value}
          name={id}
          checked={data === option.value}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleChange(path, event.currentTarget.value)
          }
          disabled={!enabled}
        />
          <label htmlFor={option.value}>{option.label}</label>
        </div>
        ))}
      </div>
      <div className={divClassNames}>
        {!isValid ? errors : showDescription ? description : null}
      </div>
    </div>
  )
}

export default withVanillaControlProps(withJsonFormsEnumProps(Renderer))
