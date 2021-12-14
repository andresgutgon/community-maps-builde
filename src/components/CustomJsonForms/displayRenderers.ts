import { verticalLayoutTester, VerticalLayout } from '@jsonforms/vanilla-renderers'

// Our custom display renderers
import {
  TextDisplay,
  WarningDisplay,
  textTester,
  warningTester
} from '@maps/components/CustomJsonForms/Renderers/displays/Text'
import LinksLayout, { linksTester } from '@maps/components/CustomJsonForms/Renderers/layouts/Links'
import LinkDisplay, { linkDisplayTester } from '@maps/components/CustomJsonForms/Renderers/displays/Link'

const renderers = [
  { tester: verticalLayoutTester, renderer: VerticalLayout },
  { tester: warningTester, renderer: WarningDisplay },
  { tester: linksTester, renderer: LinksLayout },
  { tester: textTester, renderer: TextDisplay },
  { tester: linkDisplayTester, renderer: LinkDisplay }
]

export default renderers
