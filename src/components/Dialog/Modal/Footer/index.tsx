import { ReactElement, Fragment, Children, ReactNode } from 'react'
import cn from 'classnames'

// Exclude `false` or `null` children
const notEmptyChildren = (children: Array<ReactNode>): ReactNode => {
  return children.filter((child: ReactNode | null) => !!child)
}

type ContentProps = { children: ReactNode; stackFooterButtons: boolean }
const Content = ({ children, stackFooterButtons }: ContentProps) => (
  <div
    className={
      cn(
        'bg-gray-50 px-4 py-3 sm:px-6 flex',
        {
          'space-y-2 flex-col items-center': stackFooterButtons,
          'space-y-2 sm:space-y-0 space-x-2 space-x-reverse flex-col sm:flex-row-reverse': !stackFooterButtons
        }
    )
    }
  >
    {children}
  </div>
)

type Props = { content: ReactNode | null; stackFooterButtons: boolean }
const Footer = ({ content, stackFooterButtons }: Props) => {
  if (!content) return null

  const firstElement = Children.only(content) as ReactElement<any>

  const isFragment =
    typeof firstElement === 'object' && firstElement.type === Fragment

  if (isFragment) {
    const children = notEmptyChildren(firstElement.props.children)
    // Fragment with an array of [null, false, ...]
    if (!Children.toArray(children).length) return null

    return <Content stackFooterButtons={stackFooterButtons}>{children}</Content>
  }

  return <Content stackFooterButtons={stackFooterButtons}>{content}</Content>
}

export default Footer
