import { useMemo, useState, useEffect } from 'react'
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
  const formattedValue = useFormatValue({ value, format, currency })
  useEffect(() => {
    handleChange(path, value)
  }, [handleChange, path, value])
  const backgroundColor = 'bg-gray-600'
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
      <SliderInput
        className='max-w-full disabled:pointer-events-none disabled:opacity-50'
        max={schema.maximum}
        min={schema.minimum}
        step={step}
        onChange={(newValue: number) => setValue(newValue) }
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
                'cursor-cursor shadow w-4 h-4 rounded-full z-10 origin-center -top-1/2',
                backgroundColor
              )
            }
          />
        </SliderTrack>
      </SliderInput>
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
