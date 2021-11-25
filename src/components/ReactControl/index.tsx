import DummyControl from './DummyControl'
import { createControlComponentWithChildren } from './createControlComponentWithChildren'

import type { ControlOptionsWithChildren } from './DummyControl'

/**
 *
 * This is the way we have to put a Leaflet.Control with our React components
 * inside.
 */
const ReactControl = createControlComponentWithChildren<
  DummyControl,
  ControlOptionsWithChildren
>(function createControlWithChildren(props) {
  return new DummyControl(props)
})


export default ReactControl
