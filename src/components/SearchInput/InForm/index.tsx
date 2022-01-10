import { useState } from 'react'
import cn from 'classnames'

import type { GeocodingResult } from '@maps/components/SearchInput/geocoders'
import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import { Styles } from '@maps/components/Button'
import { RoundedSize } from '@maps/components/Button/useBorderRadius'
import { ResultsTopSpace, ResultsXSpace } from '@maps/components/SearchInput/useSearchInputProps'

import SearchInput, { CommonSearchProps } from '../index'

type Props = CommonSearchProps & { onSearch: (result: GeocodingResult) => void }
const SearchInFom = (props: Props) => {
  const [autoFocus, setAutofocus] = useState(true)
  const [forceReset, setReset] = useState(+new Date())
  const styles = useStyles()
  return (
    <SearchInput
      {...props}
      inputButtonSeparation={false}
      inputClasses={cn(styles.input, 'rounded-tr-none', 'rounded-br-none', 'border-r-0')}
      resultsTopSpace={ResultsTopSpace.sm}
      buttonWithShadow
      buttonShowFocus
      buttonOutline
      buttonStyle={Styles.secondary}
      buttonRounded={{ topLeft: RoundedSize.none, bottomLeft: RoundedSize.none }}
    />
  )
}

export default SearchInFom
