import { ReactNode } from 'react'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'

type Props = { legend: string | ReactNode; children: null | ReactNode }
const Fieldset = ({ legend, children }: Props) => {
  const styles = useStyles()

  if (!children) return null

  return (
    <fieldset className={styles.group.layout}>
      <legend className={styles.group.label}>
        {legend}
      </legend>
      {children}
    </fieldset>
  )
}

export default Fieldset
