import { SyntheticEvent, forwardRef, ReactNode } from 'react'
import cn from 'classnames'

export enum Styles {
  branded = 'branded',
  primary = 'primary',
  secondary = 'secondary',
  transparent = 'transparent'
}
export enum Types { button = 'button', submit = 'submit' }
export enum Size { sm = 'sm', md = 'md', none = 'none' }

type SizeClasses = {
  padding: string,
  text: string
}
const SIZES: Record<Size, SizeClasses> = {
  sm: { padding: 'px-2 py-1 ', text: 'text-sm font-medium' },
  md: { padding: 'px-4 py-2 ', text: 'text-base font-medium' },
  none: { padding: 'p-1', text: 'text-base font-medium' }
}
const useSize = (size: Size): SizeClasses => {
  return SIZES[size]
}

type Props = {
  style: Styles,
  children: ReactNode,
  size?: Size,
  type?: Types,
  fullWidth?: boolean,
  disabled?: boolean,
  outline?: boolean,
  onClick?: (event: SyntheticEvent) => void
}

const Button = forwardRef<HTMLButtonElement, Props>(function Button (
  { children, style, onClick, outline, disabled, type, size, fullWidth }, ref
) {
  // FIXME: Unhardcode branded color and make a theme that use the config
  // from Odoo servers
  if (type === Types.button && !onClick) {
    throw new Error('A button has type "button" but it does not have "onClick" prop')
  }
  const { padding, text } = useSize(size)
  const buttonType = onClick ? Types.button : type
  return (
    <button
      ref={ref}
      type={buttonType}
      disabled={disabled}
      onClick={onClick}
      className={
      cn(
        'rounded ',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'focus:ring-gray-500', // Review when theming. Put the right ring color on branded style
        'disabled:text-opacity-80 disabled:cursor-default border',
        padding, text,
        {
          'w-full sm:w-auto': fullWidth,
          'bg-[#facb00] text-[#3f3e3e] hover:bg-[#e9bd00] border-transparent': !outline && Styles.branded === style,
          'bg-white border-[#facb00] text-[#3f3e3e] hover:bg-gray-50': outline && Styles.branded === style,
          'bg-white text-gray-700 hover:bg-gray-50': outline && Styles.secondary === style,
          'bg-transparent text-gray-700 border-none': Styles.transparent === style,
          'shadow-sm hover:shadow transition-shadow active:shadow-inner': !disabled && Styles.transparent !== style,
          'disabled:bg-gray-200 disabled:bg-opacity-80 disabled:text-gray-600 hover:shadow-none': !outline
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
