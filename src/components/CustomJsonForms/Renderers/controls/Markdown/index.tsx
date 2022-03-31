import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { rankWith, RankedTester, uiTypeIs, ControlProps } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import {
  withVanillaControlProps,
  VanillaRendererProps
} from '@jsonforms/vanilla-renderers'

const isMarkdown = uiTypeIs('Control')

export const markdownTester: RankedTester = rankWith(10, isMarkdown)

type Props = ControlProps & VanillaRendererProps
const MarkdownControl = ({ uischema, visible, classNames }: Props) => {
  const markdown = uischema?.options?.markdown

  if (!visible) return null

  return (
    <div className={classNames.wrapper}>
      <ReactMarkdown rehypePlugins={[rehypeRaw]} children={markdown} />
    </div>
  )
}

export default withVanillaControlProps(
  withJsonFormsControlProps(MarkdownControl)
)
