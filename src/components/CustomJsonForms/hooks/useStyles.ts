import { useRef } from 'react'

import { formStyles } from '@maps/lib/jsonForms/styles'

type ReturnType = {
  description: string,
  descriptionError: string
}
const useStyles = (): ReturnType => {
  const description = useRef(
    [
      ...formStyles.styles.find(style => style.name === 'control.validation').classNames,
      ...formStyles.styles.find(style => style.name === 'input.description').classNames
    ].join(' ')
  ).current
  const descriptionError = useRef(
    formStyles.styles.find(style => style.name === 'control.validation.error').classNames.join(' ')
  ).current

  return { description, descriptionError}
}

export default useStyles
