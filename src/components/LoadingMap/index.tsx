import { useRouter } from 'next/router'
const LOADING_TEXT = {
  es: 'Cargando mapa...',
  ca: 'Carregant mapa...'
}
const LoadingMap = () => {
  const { locale } = useRouter()
  return (
    <div className='flex items-center justify-center z-40 bg-gray-50 w-screen h-screen'>
      <div className='text-base text-gray-600'>
        {LOADING_TEXT[locale] || LOADING_TEXT.es}
      </div>
    </div>
  )
}

export default LoadingMap
