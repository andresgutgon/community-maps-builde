const round = (num) =>
    num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')
const rem = (px) => `${round(px / 16)}rem`
const em = (px, base) => `${round(px / base)}em`

module.exports = {
  purge: [
    './src/components/**/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}'
  ],
  mode: 'jit',
  theme: {
    extend: {
      zIndex: {
        leafletControlSearchControl: 801
      },
      typography: {
        sm: {
          css: {
            fontSize: rem(12),
            lineHeight: round(20 / 12),
            a: {
              textDecoration: 'underline'
            },
            p: {
              marginTop: em(4, 12),
              marginBottom: em(4, 12),
            }
          },
        },
      },
      borderRadius: {
        inherit: 'inherit'
      },
      outline: {
        white: '2px solid rgba(255, 255, 255, 0.5)',
      },
      transitionProperty: {
        'width': 'width',
        'left': 'left'
      },
    },
  },
  variants: {
    extend: {
      textColor: ['checked'],
      borderColor: ['checked'],
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}
