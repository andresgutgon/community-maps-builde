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
  disabled?: boolean
}
export default function Slider({
  color = Color.default,
  minimum,
  maximum,
  step,
  onChange,
  defaultValue,
  value,
  disabled = false
}: Props) {
  return (
    <SliderInput
      className={
        cn(
          'relative -bottom-2 pt-2 max-w-full disabled:pointer-events-none',
          { 'opacity-50': disabled }
        )
      }
      max={maximum}
      min={minimum}
      step={step}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <SliderTrack
        className={
          cn(
            'w-full transition-colors h-2 top-[calc(-0.5rem-1px)] relative rounded-full before:content-[""] before:absolute',
            {
              'bg-gray-100': disabled || color === Color.default,
              [`${COLORS[color]} bg-opacity-20`]: !disabled && color === Color.success
            }
          )
        }
      >
        <SliderRange
          className={
            cn(
              'h-full transition-colors rounded-inherit left-0 bottom-0 bg-opacity-70',
              COLORS[disabled ? Color.default : color]
            )
          }
        />
        <SliderHandle
          className={
            cn(
              'cursor-cursor transition-colors shadow w-4 h-4 rounded-full z-10 origin-center -top-1/2 outline-white/50 outline-2 outline-double',
              COLORS[disabled ? Color.default : color]
            )
          }
        />
      </SliderTrack>
    </SliderInput>
  )
}
