import Head from 'next/head'
import { AppProps } from 'next/app'

// Styles
import '../styles/index.css'
import '@fortawesome/fontawesome-free/css/all.css'

function CommunityBuilderApp ({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Constructor de mapas</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default CommunityBuilderApp
