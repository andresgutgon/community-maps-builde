import { useEffect, ReactNode } from 'react'
import { Control } from 'leaflet'
import { LeafletElement, createElementHook, LeafletContextInterface, createControlHook } from '@react-leaflet/core'

import { ControlOptionsWithChildren } from './DummyControl'
import { createContainerComponent } from './createContainerComponent'

export function createControlComponentWithChildren<
  E extends Control,
  P extends ControlOptionsWithChildren,
>(createInstance: (props: P) => E) {
  function createElement(
    props: P,
    context: LeafletContextInterface,
  ): LeafletElement<E> {
    return { instance: createInstance(props), context }
  }
  const useElement = createElementHook(createElement)
  const useControl = createControlHook(useElement)

  return createContainerComponent(useControl)
}

