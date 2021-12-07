import cn from 'classnames'
import { ErrorObject } from 'ajv'
import { isDescriptionHidden, ControlElement } from '@jsonforms/core'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'

const FORCE_FOCUS_TO_SHOW_DESCRIPTION = true
type Props = {
  errors: string | ErrorObject[],
  uischema: ControlElement,
  visible: boolean,
  description: string,
  isFocus?: boolean
}
const RendererComment = ({ description, visible, errors, uischema, isFocus }: Props) => {
  const styles = useStyles()
  const isValid = errors.length === 0
  const showUnfocusedDescription = uischema?.options?.showUnfocusedDescription
  const showDescription = !isDescriptionHidden(
    visible,
    description,
    isFocus,
    showUnfocusedDescription
  )
  return (
    <div className={cn(styles.description, { [styles.descriptionError]: !isValid })}>
      {!isValid ? errors : showDescription ? description : null}
    </div>
  )
}

RendererComment.defaultProps = {
  isFocus: FORCE_FOCUS_TO_SHOW_DESCRIPTION
}

export default RendererComment
