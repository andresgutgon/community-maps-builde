import { ReactNode } from 'react'
import { Map, Evented, Control, Util, DomUtil, DomEvent } from 'leaflet'
import type { TileEventHandlerFn, ControlOptions } from 'leaflet'


export interface ControlOptionsWithChildren extends ControlOptions {
  children: ReactNode
}

/**
 * It's called DummyControl because is used only to place
 * React components in the places where Leaflet put their control
 * Like Leaflet.Zoom or Leaflet.Attribution.
 */
class DummyControl extends Control {
  constructor(options?: Partial<ControlOptions>) {
    super(options)
    Util.setOptions(this, options)
  }

  /**
   * The key part is the use of:
   * DomEvent.stopPropagation
   * DomEvent.disableScrollPropagation
   * DomEvent.disableClickPropagation
   *
   * These 3 utils avoid that map do zoom in/out when
   * the user is over this control. And let React take the control
   */
  onAdd(_map: Map) {
    const controlDiv = DomUtil.create("div")

    DomEvent.on(controlDiv, 'click', (event) => {
      DomEvent.stopPropagation(event)
    })
    DomEvent.disableScrollPropagation(controlDiv)
    DomEvent.disableClickPropagation(controlDiv)

    return controlDiv
  }
}

export default DummyControl
