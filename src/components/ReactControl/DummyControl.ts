import { ReactNode } from 'react'
import { Map, Evented, Control, Util, DomUtil, DomEvent } from 'leaflet'
import type { TileEventHandlerFn, ControlOptions } from 'leaflet'
import { addClassName } from '@react-leaflet/core'


export interface ControlOptionsWithChildren extends ControlOptions {
  children: ReactNode,
  className?: string
}

/**
 * It's called DummyControl because is used only to place
 * React components in the places where Leaflet put their control
 * Like Leaflet.Zoom or Leaflet.Attribution.
 */
class DummyControl extends Control {
  constructor(options?: Partial<ControlOptionsWithChildren>) {
    super(options)
    Util.setOptions(this, options)
  }

  setClass (className: string = '', prevClassName: string = '') {
    const oldClasses = prevClassName.split(' ')
    const newClasses = className.split(' ')
    const container = this.getContainer()
    container.classList.remove(...oldClasses)
    container.classList.add(...newClasses)
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
    const options = this.options as ControlOptionsWithChildren
    addClassName(
      controlDiv,
      `shadow rounded bg-white p-1 sm:p-2 ${options.className}`
    )

    DomEvent.on(controlDiv, 'click', (event) => {
      DomEvent.stopPropagation(event)
    })
    DomEvent.disableScrollPropagation(controlDiv)
    DomEvent.disableClickPropagation(controlDiv)

    return controlDiv
  }
}

export default DummyControl
