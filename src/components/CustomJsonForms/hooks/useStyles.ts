import { useRef } from 'react'

import { formStyles } from '@maps/components/CustomJsonForms/styles'

type GroupStyles = {
  layout: string,
  label: string
}
type RadioStyles = {
  wrap: string,
  option: string,
  input: string,
  label: string
}
type ReturnType = {
  input: string,
  radio: RadioStyles,
  description: string,
  descriptionError: string,
  group: GroupStyles,
  verticalLayout: string
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
  const verticalLayout = useRef(
    formStyles.styles.find(style => style.name === 'vertical.layout').classNames.join(' ')
  ).current
  const radio = useRef(
    {
      wrap: formStyles.styles.find(style => style.name === 'control.radio').classNames.join(' '),
      option: formStyles.styles.find(style => style.name === 'control.radio.option').classNames.join(' '),
      input: formStyles.styles.find(style => style.name === 'control.radio.input').classNames.join(' '),
      label: formStyles.styles.find(style => style.name === 'control.radio.label').classNames.join(' '),
    }
  ).current
  const group = useRef(
    {
      layout: formStyles.styles.find(style => style.name === 'group.layout').classNames.join(' '),
      label: formStyles.styles.find(style => style.name === 'group.label').classNames.join(' ')
    }
  ).current
  return {
    radio,
    input,
    description,
    descriptionError,
    group,
    verticalLayout
  }
}

export default useStyles
