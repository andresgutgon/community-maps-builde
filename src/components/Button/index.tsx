import { SyntheticEvent, forwardRef, ReactNode } from 'react'
import cn from 'classnames'

import useBorderRadius, { Rounded } from './useBorderRadius'

export enum Styles {
  branded = 'branded',
  primary = 'primary',
  secondary = 'secondary',
  transparent = 'transparent'
}
export enum Types {
  button = 'button',
  submit = 'submit'
}
export enum Size {
  sm = 'sm',
  md = 'md',
  none = 'none'
}

type SizeClasses = {
  padding: string
  text: string
}
const SIZES: Record<Size, SizeClasses> = {
  sm: { padding: 'px-2 py-1 ', text: 'text-xs' },
  md: { padding: 'px-4 py-1.5 ', text: 'text-base' },
  none: { padding: 'p-1', text: 'text-base' }
}
const useSize = (size: Size): SizeClasses => {
  return SIZES[size]
}

type Props = {
  style: Styles
  children: ReactNode
  size?: Size
  type?: Types
  fullWidth?: boolean
  disabled?: boolean
  rounded?: Rounded
  outline?: boolean
  focused?: boolean
  withShadow?: boolean
  onClick?: (event: SyntheticEvent) => void
}
const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    children,
    style,
    onClick,
    outline,
    disabled,
    type,
    size,
    fullWidth,
    rounded,
    focused = false,
    withShadow = false
  },
  ref
) {
  const borderRadius = useBorderRadius({ rounded })
  if (type === Types.button && !onClick) {
    throw new Error(
      'A button has type "button" but it does not have "onClick" prop'
    )
  }
  const { padding, text } = useSize(size)
  const buttonType = onClick ? Types.button : type
  return (
    <button
      ref={ref}
      type={buttonType}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'font-medium',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'focus:ring-gray-500',
        'disabled:text-opacity-80 disabled:cursor-default border',
        'disabled:bg-gray-200 disabled:bg-opacity-80 disabled:text-gray-600 hover:shadow-none',
        rounded,
        padding,
        text,
        borderRadius,
        {
          'w-full sm:w-auto': fullWidth,
          'bg-brand-button text-brand-button hover:text-brand-button-hover hover:bg-brand-button-hover border-transparent':
            !outline && Styles.branded === style,
          'bg-transparent border-brand-base/50 hover:border-brand-base text-brand-button-inverted hover:bg-brand-fill hover:text-brand-button-inverted-hover':
            outline && Styles.branded === style,
          'bg-white text-gray-700 border-gray-300 hover:bg-gray-50':
            outline && Styles.secondary === style,
          'bg-white text-gray-800 hover:bg-gray-50':
            outline && Styles.primary === style,
          'bg-gray-800 text-white hover:bg-gray-900':
            !outline && Styles.primary === style,
          'bg-transparent text-gray-700 border-none':
            Styles.transparent === style,
          'shadow-sm hover:shadow transition-shadow active:shadow-inner':
            !disabled && Styles.transparent !== style,
          'shadow-sm': withShadow,
          'border-gray-500': focused
        }
      )}
    >
      {children}
    </button>
  )
})

Button.defaultProps = {
  disabled: false,
  outline: false,
  fullWidth: false,
  size: Size.md,
  type: Types.button
}

export default Button
