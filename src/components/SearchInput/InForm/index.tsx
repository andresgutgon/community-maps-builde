import { useState } from 'react'
import cn from 'classnames'

import type { GeocodingResult } from '@maps/components/SearchInput/geocoders'
import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import { Styles } from '@maps/components/Button'
import { RoundedSize } from '@maps/components/Button/useBorderRadius'
import { ResultsTopSpace, ResultsXSpace } from '@maps/components/SearchInput/useSearchInputProps'

import Input, { CommonSearchProps } from '../index'

export type SearchResult = {
  latitude: string
  longitude: string
  address: string
}
type Props = CommonSearchProps & { onSearch: (result: SearchResult) => void }
const SearchInFom = (props: Props) => {
  const styles = useStyles()
  const onSearch = (result: GeocodingResult) => {
    props.onSearch({
      latitude: result.center.lat.toString(),
      longitude: result.center.lng.toString(),
      address: result.name
    })
  }
  return (
    <Input
      {...props}
      onSearch={onSearch}
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
