import { useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AppProps } from 'next/app'
import { IntlProvider } from 'react-intl'

// LOCALES
import ES_LOCALE from '../../content/compiled-locales/es.json'
import CA_LOCALE from '../../content/compiled-locales/ca.json'

// Styles
import '../styles/index.css'
import '@fortawesome/fontawesome-free/css/all.css'

function CommunityBuilderApp({ Component, pageProps }: AppProps) {
  const { locale, defaultLocale } = useRouter()
  const [shortLocale] = locale ? locale.split('-') : [defaultLocale]

  const messages = useMemo(() => {
    switch (shortLocale) {
      case 'es':
        return ES_LOCALE
      case 'ca':
        return CA_LOCALE
      default:
        return ES_LOCALE
    }
  }, [shortLocale])
  return (
    <>
      <Head>
        <title>Constructor de mapas</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <IntlProvider
        locale={shortLocale}
        messages={messages}
        onError={() => null}
      >
        <Component {...pageProps} />
      </IntlProvider>
    </>
  )
}

export default CommunityBuilderApp
