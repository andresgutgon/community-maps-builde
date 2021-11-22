import Head from 'next/head'
import { AppProps } from 'next/app'
import '../styles/index.css'

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
