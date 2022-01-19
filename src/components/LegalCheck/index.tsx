import { useEffect } from 'react'
import cn from 'classnames'
import { useIntl } from 'react-intl'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import { useMapData } from '@maps/components/CommunityProvider'

export const MUST_ACCEPT_TERMS = 'MUST_ACCEPT_TERMS'

const LegalLink = ({ href, text }) =>
  <a href={href} className='underline' target='_blank' rel='noreferrer'>{text}</a>

const LegalCheck = ({ error, checked, onCheck }) => {
  const styles = useStyles()
  const intl = useIntl()
  const { config: { legal } } = useMapData()
  const isValid = error !== MUST_ACCEPT_TERMS
  const hasALink = !!legal?.privacyLink || !!legal?.cookiesLink
  const errorMessage = intl.formatMessage({ defaultMessage: 'Debes aceptar los términos de legales', id: '3vFpuC' })
  const privacyLinkText = intl.formatMessage({ defaultMessage: 'Política de privacidad', id: 'l4IlHe' })
  const cookiesLinkText = intl.formatMessage({ defaultMessage: 'Política de cookies', id: 'oxv0hl' })
  useEffect(() => {
    if (hasALink) return
    onCheck(true)
  }, [onCheck, hasALink])
  const onChange = () => {
    onCheck(!checked)
  }

  // At least privacy or cookies link
  if (!hasALink) return null

  return (
    <label htmlFor='legal' className='flex flex-col space-y-2'>
      <div className={styles.checkbox.group}>
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
      </div>
      {!isValid ? (
        <div className={cn({ [styles.descriptionError]: !isValid })}>
          {errorMessage}
        </div>
      ) : null}
    </label>
  )
}

export default LegalCheck
