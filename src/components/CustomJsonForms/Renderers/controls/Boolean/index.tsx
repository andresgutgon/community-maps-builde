import { ChangeEvent } from 'react'
import { computeLabel, rankWith, RankedTester, isBooleanControl, ControlProps } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { withVanillaControlProps, VanillaRendererProps } from '@jsonforms/vanilla-renderers'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import Description from '@maps/components/CustomJsonForms/components/Description'

export const booleanTester: RankedTester = rankWith(10, isBooleanControl)

type Props = ControlProps & VanillaRendererProps
const BooleanControl = ({
  id,
  label,
  required,
  description,
  errors,
  data,
  uischema,
  classNames,
  visible,
  path,
  handleChange,
  enabled
}: Props) => {
  const styles = useStyles()
  const hideRequiredAsterisk = uischema?.options?.hideRequiredAsterisk

  if (!visible) return null

  return (
    <div className={classNames.wrapper}>
      <label htmlFor={id} className={styles.checkbox.group} hidden={!visible}>
        <input
          id={id}
          type='checkbox'
          className={styles.checkbox.input}
          checked={!!data}
          disabled={!enabled}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            handleChange(path, event.target.checked)
          }}
        />
        <span className={styles.checkbox.label}>
          {computeLabel(
            label,
            required,
            hideRequiredAsterisk
          )}
        </span>
      </label>
      <Description
        errors={errors}
        uischema={uischema}
        visible={visible}
        description={description}
      />
    </div>
  )
}

export default withVanillaControlProps(withJsonFormsControlProps(BooleanControl))
