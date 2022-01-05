import { useIntl } from 'react-intl'
import { Size as ButtonSize, Types as ButtonTypes, Styles as ButtonStyles } from '@maps/components/Button'

const DEFAULT_INPUT_CLASSES = 'flex-1 bg-transparent w-[170px] sm:w-[400px] border-none focus:outline-none focus:ring-0 py-1 sm:py-2 pl-1 placeholder-gray-500 placeholder-opacity-50'
export enum ResultsTopSpace { sm = 'sm', normal = 'normal' }
export enum ResultsXSpace { normal = 'normal' }
export type SearchInputProps = {
  placeholder: string,
  buttonLabel: string,
  formClasses: string,
  inputClasses: string,
  resultsListProps: {
    top: ResultsTopSpace,
    xSpace: ResultsXSpace | undefined
  },
  buttonProps: {
    type: ButtonTypes,
    size: ButtonSize,
    style: ButtonStyles
  }
}
type Props = {
  inputClasses?: string,
  buttonStyle?: ButtonStyles,
  buttonOutline?: boolean,
  resultsTopSpace?: ResultsTopSpace
  resultsXSpace?: ResultsXSpace | null
}
export const useSearchInputProps = ({
  buttonOutline = false,
  resultsTopSpace = ResultsTopSpace.normal,
  resultsXSpace,
  inputClasses,
  buttonStyle
}: Props = {}) => {
  const intl = useIntl()
  return {
    placeholder: `${intl.formatMessage({
      defaultMessage: 'Buscar una dirección', id: 'IVA/Y9',
    })}...`,
    buttonLabel: intl.formatMessage({ defaultMessage: 'Buscar', id: 'eOuNie' }),
    formClasses: 'flex items-center justify-between  space-x-2',
    inputClasses: inputClasses || DEFAULT_INPUT_CLASSES,
    resultsListProps: {
      top: resultsTopSpace,
      xSpace: resultsXSpace
    },
    buttonProps: {
      outline: buttonOutline,
      style: buttonStyle || ButtonStyles.branded,
      type: ButtonTypes.button,
      size: ButtonSize.md
    }
  }
}
