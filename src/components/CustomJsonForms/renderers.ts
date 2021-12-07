import { vanillaRenderers } from '@jsonforms/vanilla-renderers'

// Our custom renderers
import RangeInput, { rangeTester } from './Renderers/RangeInput'

export const CUSTOM_RENDERERS_PREFIX = 'coopdevs'

/**
 * We try to use as much as possible the renderers JSONforsm offer:
 * https://jsonforms.io/docs/renderer-sets
 *
 * But if we need to do something specific for this project we can register
 * our own renderers. Please check existing code and read their docs for implementing new
 * components:
 * https://jsonforms.io/docs/tutorial/custom-renderers
 */
const renderers = [
  ...vanillaRenderers,
  { tester: rangeTester, renderer: RangeInput }
]

export default renderers
