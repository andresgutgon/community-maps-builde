import { useMemo, ReactNode } from 'react'
import cn from 'classnames'
import { UISchemaElement, JsonSchema, rankWith, RankedTester, uiTypeIs, and, schemaTypeIs, optionIs, ControlProps } from '@jsonforms/core'
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
      <div className='w-full relative -bottom-2 pt-2 max-w-full'>
        <div className='bg-green-600/20 w-full transition-colors h-3 top-[calc(-0.5rem-1px)] relative rounded-full before:content-[""] before:absolute'>
          <div
            className='bg-green-600 h-full transition-colors rounded-inherit left-0 bottom-0 bg-opacity-70'
            style={{ width: `${data}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default withJsonFormsControlProps(LinkDisplay)

