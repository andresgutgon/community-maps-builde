import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import { useMapData } from '@maps/components/CommunityProvider'

type LegalLinkProps = { href: string; text: string }
const LegalLink = ({ href, text }) =>
  <a href={href} className='underline' target='_blank' rel='noreferrer'>{text}</a>

type Props = { onCheck: (checked: boolean) => void }
const LegalCheck = ({ onCheck }) => {
  const styles = useStyles()
  const intl = useIntl()
  const { config: { legal } } = useMapData()
  const hasALink = !!legal?.privacyLink || !!legal?.cookiesLink
  const [checked, setChecked] = useState<boolean>(false)
  const privacyLinkText = intl.formatMessage({ defaultMessage: 'Política de privacidad', id: 'l4IlHe' })
  const cookiesLinkText = intl.formatMessage({ defaultMessage: 'Política de cookies', id: 'oxv0hl' })
  useEffect(() => {
    if (hasALink) return
    setChecked(true)
    onCheck(true)
  }, [onCheck, hasALink])
  const onChange = () => {
    setChecked(!checked)
    onCheck(!checked)
  }

  // At least privacy or cookies link
  if (!hasALink) return null

  return (
    <label htmlFor='legal' className={styles.checkbox.group}>
      <input
        id='legal'
        type='checkbox'
        className={styles.checkbox.input}
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.checkbox.label}>
        {(legal.privacyLink && legal.cookiesLink) ? (
          intl.formatMessage(
            { id: 'mFDtrP', defaultMessage: 'Acepto la {privacyLink} y la {cookiesLink}' },
            {
              privacyLink: <LegalLink href={legal.privacyLink} text={privacyLinkText} />,
              cookiesLink: <LegalLink href={legal.cookiesLink} text={cookiesLinkText} />
            }
          )
        ) : null}
        {(legal.privacyLink && !legal.cookiesLink) ? (
          intl.formatMessage(
            { id: 'spATk4', defaultMessage: 'Acepto la {link}' },
            {
              link: <LegalLink href={legal.privacyLink} text={privacyLinkText} />
            }
          )
        ) : null}
        {(!legal.privacyLink && legal.cookiesLink) ? (
          intl.formatMessage(
            { id: 'spATk4', defaultMessage: 'Acepto la {link}' },
            {
              link: <LegalLink href={legal.cookiesLink} text={cookiesLinkText} />
            }
          )
        ) : null}
      </span>
    </label>
  )
}

export default LegalCheck
