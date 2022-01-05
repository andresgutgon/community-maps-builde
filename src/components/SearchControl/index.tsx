import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'

import ReactControl from '@maps/components/ReactControl/index'
import { ResultsTopSpace, ResultsXSpace,  useSearchInputProps } from '@maps/components/SearchInput/useSearchInputProps'
import Button, { Types as ButtonTypes, Styles as ButtonStyles } from '@maps/components/Button'

type FakeSearchProps = { onClick?: () => void, disabled?: boolean }
const FakeSearch = ({ onClick, disabled = false }: FakeSearchProps) => {
  const { placeholder, buttonLabel, formClasses, inputClasses, buttonProps } = useSearchInputProps({
    resultsXSpace: ResultsXSpace.normal
  })
  return (
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
  )
}

type Props = { locale: string }
const SearchControl = ({ locale }: Props) => {
  const [Search, setSearch] = useState(null)
  const onClick = async () => {
    const Component = await dynamic(
      () => import('@maps/components/SearchInput'),
      { loading: () => <FakeSearch disabled /> }
    )
    setSearch(Component)
  }
  return (
    <ReactControl className='leaflet-search leaflet-expanded-control' position='topleft'>
      {Search ? (
        <Search
          locale={locale}
          resultsTopSpace={ResultsTopSpace.normal}
          resultsXSpace={ResultsXSpace.normal}
        />
      ): (
        <FakeSearch onClick={onClick} />
      )}
    </ReactControl>
  )
}

export default SearchControl
