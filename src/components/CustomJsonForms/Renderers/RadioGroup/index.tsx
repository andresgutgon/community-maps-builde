import { useRef } from 'react'
import merge from 'lodash/merge'
import cn from 'classnames'
import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { CheckCircleIcon as CheckCircleOutlineIcon} from '@heroicons/react/outline'
import { formStyles } from '@maps/lib/jsonForms/styles'
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

type IconProps = { checked: boolean }
export const radioGroupTester: RankedTester = rankWith(
  10, //increase rank as needed
  and(isEnumControl, optionIs('format', buildScope('radio')))
)

type Option = { label: string, value: any, description?: string }
const FORCE_FOCUS_TO_SHOW_DESCRIPTION = true
type Props = ControlProps & VanillaRendererProps & OwnPropsOfEnum
const Renderer = ({
  classNames,
  id,
  label,
  required,
  description,
  errors,
  data,
  schema,
  uischema,
  visible,
  config,
  path,
  handleChange,
  enabled
}: Props) => {
  const isValid = errors.length === 0
  const descriptionStyles = useRef(
    [
      ...formStyles.styles.find(style => style.name === 'control.validation').classNames,
      ...formStyles.styles.find(style => style.name === 'input.description').classNames
    ]
  ).current
  const errorStyles = useRef(
    formStyles.styles.find(style => style.name === 'control.validation.error').classNames
  ).current
  const descriptionErrors = !isValid ? errorStyles : null
  const appliedUiSchemaOptions = merge({}, config, uischema.options)
  const computedLabel = computeLabel(
    label,
    required,
    appliedUiSchemaOptions.hideRequiredAsterisk
  )
  const showDescription = !isDescriptionHidden(
    visible,
    description,
    FORCE_FOCUS_TO_SHOW_DESCRIPTION,
    appliedUiSchemaOptions.showUnfocusedDescription
  )
  const options = appliedUiSchemaOptions.enum_i18n
  const stacked = appliedUiSchemaOptions.stacked
  return (
    <div className={classNames.wrapper} hidden={!visible}>
      <RadioGroup value={data} onChange={(value: any) => { handleChange(path, value) }}>
        <RadioGroup.Label className={classNames.label}>{computedLabel}</RadioGroup.Label>
        <div
          className={
            cn({
              'flex flex-row space-x-2': stacked,
              'space-y-2': !stacked,
            })
          }
        >
          {options.map((option: Option) => (
            <RadioGroup.Option
              key={option.label}
              value={option.value}
              disabled={!enabled}
              className={({ active, checked }) =>
                cn(
                  'flex-1 relative rounded border p-4 cursor-pointer flex focus:outline-none',
                  {
                    'ring-2 ring-offset-2  ring-white ring-opacity-60': active,
                    'bg-[#facb00] border-[#3f3e3e] ring-offset-[#3f3e3e]': checked,
                    'bg-gray-100 border-gray-200 ring-offset-gray-600': !checked
                  }
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <div className="flex items-center justify-between space-x-2 w-full">
                    <div className="flex flex-col items-start">
                      <RadioGroup.Label
                        as="p"
                        className={`text-sm font-medium  ${
                          checked ? 'text-[#3f3e3e]' : 'text-gray-900'
                        }`}
                      >
                        {option.label}
                      </RadioGroup.Label>
                      {option.description ? (
                        <RadioGroup.Description
                          as="span"
                          className={
                            cn(
                              'text-xs inline',
                              {
                                'text-[#3f3e3e] text-opacity-80': checked,
                                'text-gray-500': !checked
                              }
                            )
                          }
                        >
                         {option.description}
                        </RadioGroup.Description>
                      ) : null}
                    </div>
                    <div className='flex-shrink-0'>
                      {checked ? (
                        <CheckCircleIcon className='w-6 h-6 text-[#3f3e3e]' />
                      ): (
                        <CheckCircleOutlineIcon className='w-6 h-6 text-gray-200' />
                      )}
                    </div>
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <div className={cn(descriptionStyles, descriptionErrors)}>
        {!isValid ? errors : showDescription ? description : null}
      </div>
    </div>
  )
}

export default withVanillaControlProps(withJsonFormsEnumProps(Renderer))
