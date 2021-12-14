import cn from 'classnames'

import { Layout, RankedTester, rankWith, RendererProps, uiTypeIs, UISchemaElement } from '@jsonforms/core'
import { useJsonForms, JsonFormsDispatch, withJsonFormsLayoutProps } from '@jsonforms/react'
import { VanillaRendererProps, withVanillaControlProps } from '@jsonforms/vanilla-renderers'

export const linksTester: RankedTester = rankWith(1, uiTypeIs('Links'))

interface LinksLayout extends Layout { type: 'Links' }
export const LinksRenderer = ({
  schema,
  uischema,
  path,
  visible,
  getStyle,
  getStyleAsClassName
}: RendererProps & VanillaRendererProps) => {
  const { renderers, cells } = useJsonForms()
  const links = (uischema as LinksLayout).elements
  return (
    <ul
      className='flex space-x-2'
      hidden={visible === undefined || visible === null ? false : !visible}
    >
      {links.map((element: UISchemaElement, index: number) =>
        <li
          key={`${path}-${index}`}
          attr-separator='|'
          className={cn({ "pr-1 after:inline-block after:ml-2 after:content-[attr(attr-separator)]": index !== links.length - 1 })}
        >
          <JsonFormsDispatch
            enabled
            renderers={renderers}
            cells={cells}
            uischema={element}
            schema={schema}
            path={path}
          />
        </li>
      )}
    </ul>
  )
}

export default withVanillaControlProps(withJsonFormsLayoutProps(LinksRenderer))
