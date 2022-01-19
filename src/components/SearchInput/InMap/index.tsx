import {
  ResultsTopSpace,
  ResultsXSpace
} from '@maps/components/SearchInput/useSearchInputProps'

import Input, { SearchInputProps } from '../index'

const SearchInputMap = (props: SearchInputProps) => (
  <Input
    {...props}
    resultsTopSpace={ResultsTopSpace.normal}
    resultsXSpace={ResultsXSpace.normal}
  />
)

export default SearchInputMap
