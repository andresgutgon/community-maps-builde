import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'

import ReactControl from '@maps/components/ReactControl/index'
import Button, { Types as ButtonTypes, Styles as ButtonStyles } from '@maps/components/Button'

export type CommonProps = {
  placeholder: string,
  buttonLabel: string,
  formClasses: string,
  inputClasses: string,
  buttonProps: {
    type: ButtonTypes,
    style: ButtonStyles
  }
}
type FakeSearchProps = CommonProps & {
  onClick?: () => void,
  disabled?: boolean
}
const FakeSearch = ({
  placeholder,
  buttonLabel,
  formClasses,
  inputClasses,
  buttonProps,
  onClick,
  disabled = false
}: FakeSearchProps) =>
  <div {...(onClick ? { onClick, className: formClasses } : { className: formClasses })}>
    <input
      disabled={disabled}
      className={inputClasses}
      placeholder={placeholder}
      type='text'
    />
    <Button
      disabled
      style={ButtonStyles.branded}
      type={ButtonTypes.submit}
    >
      {buttonLabel}
    </Button>
  </div>
type Props = { locale: string }
const SearchControl = ({ locale }: Props) => {
  const intl = useIntl()
  const [Search, setSearch] = useState(null)
  const commonProps = {
    placeholder: `${intl.formatMessage({
      defaultMessage: 'Buscar una dirección', id: 'IVA/Y9',
    })}...`,
    buttonLabel: intl.formatMessage({ defaultMessage: 'Buscar', id: 'eOuNie' }),
    formClasses: 'flex items-center justify-between  space-x-1',
    inputClasses: 'flex-1 bg-transparent w-[170px] sm:w-[400px] border-none focus:outline-none focus:ring-0 py-1 sm:py-2 pl-1 placeholder-gray-500 placeholder-opacity-50',
    buttonProps: {
      style: ButtonStyles.branded,
      type: ButtonTypes.submit
    }
  }
  const onClick = async () => {
    const Component = await dynamic(
      () => import('./Search'),
      { loading: () => <FakeSearch disabled {...commonProps} /> }
    )
    setSearch(Component)
  }
  return (
    <ReactControl className='leaflet-search leaflet-expanded-control' position='topleft'>
      {Search ? (
        <Search {...commonProps} locale={locale} />
      ): (
        <FakeSearch onClick={onClick} {...commonProps} />
      )}
    </ReactControl>
  )
}

export default SearchControl
