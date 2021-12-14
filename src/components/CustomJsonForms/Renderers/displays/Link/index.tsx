import { useMemo, ReactNode } from 'react'
import cn from 'classnames'
import { FormatMessage} from 'react-intl'
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
const LinkDisplay = ({ data, label }: TextDisplayProps) =>
  <a className='text-xs' href={data} target="_blank" rel='noreferrer' title={label}>
   {label}
  </a>

export default withJsonFormsControlProps(LinkDisplay)

