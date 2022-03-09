import {
  ControlElement,
  rankWith,
  RankedTester,
  uiTypeIs,
} from '@jsonforms/core'

const isImage = (
  uiTypeIs('Control')
)

export const imageTester: RankedTester = rankWith(10, isImage)


type Props = {
  src?: string
  alt: string
  uischema: ControlElement
  visible: boolean
}
const RendererImage = ({
  src,
  visible,
  uischema,
}: Props) => {
  // const showImage = !isImageHidden(
    // visible,
    src
  // )
  return (
    <div className='sm:p-6'>
      {/* {showImage ? src : null} */}
      <img className='rounded-xl' src={src}/>
    </div>
  )
}

export default RendererImage
