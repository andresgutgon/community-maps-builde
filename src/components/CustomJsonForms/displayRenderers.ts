import { verticalLayoutTester, VerticalLayout } from '@jsonforms/vanilla-renderers'

// Our custom display renderers
import {
  TextDisplay,
  WarningDisplay,
  textTester,
  warningTester
} from '@maps/components/CustomJsonForms/Renderers/displays/Text'

const renderers = [
  { tester: verticalLayoutTester, renderer: VerticalLayout },
  { tester: warningTester, renderer: WarningDisplay },
  { tester: textTester, renderer: TextDisplay }
]

export default renderers
