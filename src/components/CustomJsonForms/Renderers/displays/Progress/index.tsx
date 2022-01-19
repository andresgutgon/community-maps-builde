import { rankWith, RankedTester, uiTypeIs, and, schemaTypeIs, optionIs, ControlProps } from '@jsonforms/core'
import ProgressIndicator from '@maps/components/ProgressIndicator'
import { withJsonFormsControlProps } from '@jsonforms/react'

const isProgressDisplay = and(
  uiTypeIs('Display'),
  schemaTypeIs('number'),
  optionIs('progress', true)
)
export const progressTester: RankedTester = rankWith(10, isProgressDisplay)

enum TextDisplayType { default = 'default', warning = 'warning' }
type TextDisplayProps = ControlProps & {
  type: TextDisplayType
}
const LinkDisplay = ({ label, data }: TextDisplayProps) => {
  return (
    <div className='flex flex-col w-full'>
      <h3 className='text-base text-gray-800 font-medium'>
        {`${label} (${data}%)`}
      </h3>
      <ProgressIndicator value={data} size='normal' />
    </div>
  )
}

export default withJsonFormsControlProps(LinkDisplay)

