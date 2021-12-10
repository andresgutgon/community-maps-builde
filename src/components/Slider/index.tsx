import cn from 'classnames'
import { SliderInput, SliderTrack, SliderRange, SliderHandle } from '@reach/slider'

export enum Color {
  default = 'default',
  success = 'success'
}
const COLORS = {
  [Color.default]: 'bg-gray-600',
  [Color.success]: 'bg-green-600'
}
type Props = {
  minimum: number,
  maximum: number,
  step: number,
  onChange: (value: number) => void,
  color?: Color,
  defaultValue?: number,
  value?: number
}
export default function Slider({
  color = Color.default,
  minimum,
  maximum,
  step,
  onChange,
  defaultValue,
  value
}: Props) {
  return (
    <SliderInput
      className='relative -bottom-2 pt-2 max-w-full disabled:pointer-events-none disabled:opacity-50'
      max={maximum}
      min={minimum}
      step={step}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
    >
      <SliderTrack
        className={
          cn(
            'w-full transition-colors h-2 top-[calc(-0.5rem-1px)] relative rounded-full before:content-[""] before:absolute',
            {
              'bg-gray-100': color === Color.default,
              [`${COLORS[color]} bg-opacity-20`]: color === Color.success
            }
          )
        }
      >
        <SliderRange
          className={
            cn(
              'h-full transition-colors rounded-inherit left-0 bottom-0 bg-opacity-70',
              COLORS[color]
            )
          }
        />
        <SliderHandle
          className={
            cn(
              'cursor-cursor transition-colors shadow w-4 h-4 rounded-full z-10 origin-center -top-1/2 outline-white',
              COLORS[color]
            )
          }
        />
      </SliderTrack>
    </SliderInput>
  )
}
