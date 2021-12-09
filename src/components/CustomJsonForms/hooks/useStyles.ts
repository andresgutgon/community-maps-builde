import { useRef } from 'react'

import { formStyles } from '@maps/components/CustomJsonForms/styles'

type ReturnType = {
  input: string,
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
  const input = useRef(
    formStyles.styles.find(style => style.name === 'control.input').classNames.join(' ')
  ).current

  return { input, description, descriptionError}
}

export default useStyles
