import cn from 'classnames'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import { Styles } from '@maps/components/Button'
import { RoundedSize } from '@maps/components/Button/useBorderRadius'
import { ResultsTopSpace, ResultsXSpace } from '@maps/components/SearchInput/useSearchInputProps'

import Input, { SearchInputProps } from '../index'

const SearchInputMap = (props: SearchInputProps) => {
  const styles = useStyles()
  return (
    <Input
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

export default SearchInputMap
