/**
 * This API is exposed by JSONForms
 * https://github.com/eclipsesource/jsonforms/blob/master/packages/vanilla/Styles.md
 * With it you can add your own CSS to generated forms.
 *
 * This is awesome because with Tailwind is all we need to customize
 * the look and feel of the forms
 */
export const displayStyles = {
  styles: [
    {
      name: 'vertical.layout',
      classNames: ['space-y-3']
    },
    {
      name: 'vertical.layout.item',
      classNames: ['flex w-full space-y-2']
    }
  ]
}
