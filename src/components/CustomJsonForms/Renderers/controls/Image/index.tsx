import { rankWith, RankedTester, uiTypeIs, ControlProps } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import {
  withVanillaControlProps,
  VanillaRendererProps
} from '@jsonforms/vanilla-renderers'

const isImage = uiTypeIs('Control')

export const imageTester: RankedTester = rankWith(10, isImage)

type Props = ControlProps & VanillaRendererProps
const ImageControl = ({ uischema, visible, classNames }: Props) => {
  const src = uischema?.options?.src

  if (!visible) return null

  return (
    <div className={classNames.wrapper}>
      <img src={src} />
    </div>
  )
}

export default withVanillaControlProps(withJsonFormsControlProps(ImageControl))
