import { rankWith, RankedTester, uiTypeIs, ControlProps } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import sanitizeHtml from 'sanitize-html'
import {
  withVanillaControlProps,
  VanillaRendererProps
} from '@jsonforms/vanilla-renderers'

const isDisplay = uiTypeIs('Display')

export const displayTester: RankedTester = rankWith(10, isDisplay)

type Props = ControlProps & VanillaRendererProps
const DisplayControl = ({ uischema, visible, classNames }: Props) => {
  if (!visible) return null
  const html = uischema?.options?.html
  const sanitized_html = sanitizeHtml(html, {
    allowedTags: ['div', 'img', 'br', 'ul', 'li', 'p', 'strong', 'a', 'span'],
    allowedAttributes: {
      div: ['class'],
      img: ['class', 'src'],
      ul: ['class'],
      li: ['class'],
      p: ['class'],
      a: ['class', 'href', 'target'],
      span: ['class']
    }
  }).trim()

  return (
    <div
      className={classNames.wrapper}
      dangerouslySetInnerHTML={{ __html: sanitized_html }}
    ></div>
  )
}

export default withVanillaControlProps(
  withJsonFormsControlProps(DisplayControl)
)
