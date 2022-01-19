import { useRouter } from 'next/router'
import cn from 'classnames'

export enum LoadingMapType {
  Error,
  Info
}
const LOADING_TEXT = {
  es: 'Cargando mapa...',
  ca: 'Carregant mapa...'
}
type Props = { message?: string; type?: LoadingMapType }
const LoadingMap = ({ message, type = LoadingMapType.Info }: Props) => {
  const { locale } = useRouter()
  const hasError = type === LoadingMapType.Error
  const loadingMessage = LOADING_TEXT[locale] || LOADING_TEXT.es
  return (
    <div
      className={cn('flex items-center justify-center z-40 w-screen h-screen', {
        'bg-gray-50 ': !hasError,
        'bg-red-500': hasError
      })}
    >
      <div
        className={cn('text-base', {
          'text-gray-600': !hasError,
          'text-white': hasError
        })}
      >
        {message || loadingMessage}
      </div>
    </div>
  )
}

export default LoadingMap
