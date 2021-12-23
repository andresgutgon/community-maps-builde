import { useMemo, ReactNode } from 'react'
import cn from 'classnames'
import { UISchemaElement, JsonSchema, rankWith, RankedTester, uiTypeIs, and, schemaTypeIs, formatIs, ControlProps } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'

const isLinkDisplay = and(
  uiTypeIs('Display'),
  schemaTypeIs('string'),
  formatIs('uri')
)
export const linkDisplayTester: RankedTester = rankWith(10, isLinkDisplay)

enum TextDisplayType { default = 'default', warning = 'warning' }
type TextDisplayProps = ControlProps & {
  type: TextDisplayType
}
const LinkDisplay = ({ uischema, label, data }: TextDisplayProps) => {
  const hideIcon = uischema?.options?.hideExternalIcon || false
  return (
    <a className={cn('space-x-1.5 text-xs', { 'flex items-center': !hideIcon })} href={data} target="_blank" rel='noreferrer' title={label}>
      <span className='underline'>{label}</span>
      {!hideIcon && (
        <i className='relative top-[0.5px] fas fa-external-link-alt text-gray-400' />
      )}
    </a>
  )
}

export default withJsonFormsControlProps(LinkDisplay)

