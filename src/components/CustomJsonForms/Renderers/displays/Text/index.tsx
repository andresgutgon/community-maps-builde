import { useMemo } from 'react'
import cn from 'classnames'
import { rankWith, RankedTester, uiTypeIs, and, schemaTypeIs, optionIs, ControlProps } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'

const isTextDisplay = and(uiTypeIs('Display'), schemaTypeIs('string'))
export const textTester: RankedTester = rankWith(1, isTextDisplay)

const isWarningDisplay = and(
  uiTypeIs('Display'),
  schemaTypeIs('string'),
  optionIs('warning', true)
)
export const warningTester: RankedTester = rankWith(10, isWarningDisplay)

enum TextDisplayType { default = 'default', warning = 'warning' }
type TextDisplayProps = ControlProps & {
  type: TextDisplayType
}
const Text = ({ data, type }: TextDisplayProps) => {
  const content = useMemo(() => data?.replace('[markdown] ', ''), [data])
  return (
    <div
      className={
        cn(
          'prose-sm',
          {
            'border py-1 px-2 rounded bg-yellow-50 border-yellow-200 prose-yellow': type === TextDisplayType.warning,
            'prose': type === TextDisplayType.default
          }
        )
      }
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export const TextDisplay = withJsonFormsControlProps((props: ControlProps) =>
  <Text {...props} type={TextDisplayType.default} />
)

export const WarningDisplay = withJsonFormsControlProps((props: ControlProps) =>
  <Text {...props} type={TextDisplayType.warning} />
)
