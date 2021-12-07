import { memo, useMemo, useState, useEffect } from 'react'
import cn from 'classnames'
import {
  Slider,
  SliderInput,
  SliderTrack,
  SliderRange,
  SliderHandle
} from '@reach/slider'
import { rankWith, RankedTester, isRangeControl, ControlProps, computeLabel } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { withVanillaControlProps, VanillaRendererProps } from '@jsonforms/vanilla-renderers'

import Label from '@maps/components/CustomJsonForms/components/Label'
import Description from '@maps/components/CustomJsonForms/components/Description'

export const rangeTester: RankedTester = rankWith(10, isRangeControl)

type FormatProps = {
  value: number
  format: 'number' | 'currency'
  currency?: 'EUR'
}
function useFormatValue ({ value, format, currency = 'EUR' }: FormatProps): string {
  return useMemo(() => {
    if (format === 'currency') {
      return new Intl.NumberFormat(
        'de-DE', // Hardcoded for now. Change if currency is other than EUR
        {
          style: 'currency',
          minimumFractionDigits: 0,
          currency
        }
      ).format(value)
    }
    return value.toString()
  }, [value, format, currency])
}

type RangeInputSliderProps = {
  minimum: number,
  maximum: number,
  step: number,
  onValueChange: (value: number) => void,
  defaultValue?: number,
}
const RangeSliderInput = memo(function RangeSliderInput ({
  minimum, maximum, step, onValueChange, defaultValue
}: RangeInputSliderProps) {
  const backgroundColor = 'bg-gray-600'
  return (
    <SliderInput
      className='max-w-full disabled:pointer-events-none disabled:opacity-50'
      max={maximum}
      min={minimum}
      step={step}
      defaultValue={defaultValue || minimum}
      onChange={(newValue: number) => {
        onValueChange(newValue)
      }}
    >
      <SliderTrack
        className='w-full h-2 top-[calc(-0.5rem-1px)] relative rounded-full bg-gray-100 before:content-[""] before:absolute'
      >
        <SliderRange
          className={
            cn(
              'h-full rounded-inherit left-0 bottom-0 bg-opacity-70',
              backgroundColor
            )
          }
        />
        <SliderHandle
          className={
            cn(
              'cursor-cursor shadow w-4 h-4 rounded-full z-10 origin-center -top-1/2 outline-white',
              backgroundColor
            )
          }
        />
      </SliderTrack>
    </SliderInput>
  )
})

type Props = ControlProps & VanillaRendererProps
const RangeInput = ({
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
  const [value, setValue] = useState(data || schema.default)
  const step = uischema?.options?.step || 10
  const format = uischema?.options?.formatValue || 'number'
  const currency = uischema?.options?.currency || 'EUR'
  const formattedValue = useFormatValue({
    value: data || schema.default,
    format,
    currency
  })
  useEffect(() => {
    handleChange(path, schema.default)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    handleChange(path, value)
  }, [handleChange, path, value])
  return (
    <div className={classNames.wrapper} hidden={!visible}>
      <div className='mb-2'>
        <Label
          id={id}
          label={label}
          required={required}
          uischema={uischema}
          classNames={classNames}
          rightValue={formattedValue}
        />
      </div>
      <RangeSliderInput
        minimum={schema.minimum}
        maximum={schema.maximum}
        defaultValue={schema.default}
        step={step}
        onValueChange={(newValue: number) => setValue(newValue) }
      />
      <Description
        errors={errors}
        uischema={uischema}
        visible={visible}
        description={description}
      />
    </div>
  )
}

export default withVanillaControlProps(withJsonFormsControlProps(RangeInput))
