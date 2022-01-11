import { Component } from 'react'

export class MapNotFoundError  extends Error {
  constructor(slug) {
    const message = `Map not found with slug ${slug}`
    super(message)
    this.name = 'MapNotFoundError'
  }
}
type Props = {}
type State = { hasError: boolean }
class TopMapErrorBoundary extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    console.log('ERROR', error)
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

export default TopMapErrorBoundary
