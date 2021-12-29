const round = (num) =>
    num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')
const rem = (px) => `${round(px / 16)}rem`
const em = (px, base) => `${round(px / base)}em`

function withOpacity (cssVariable) {
  return ({ opacityValue }) => {
    return `rgba(var(${cssVariable}), ${opacityValue || 1})`
  }
}

module.exports = {
  purge: [
    './src/components/**/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}'
  ],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        twitter: '#00acee'
      },
      textColor: {
        brand: {
          base: withOpacity('--color-text-base'),
          button: withOpacity('--color-text-button'),
          'button-hover': withOpacity('--color-text-button-hover'),
          'button-inverted': withOpacity('--color-text-inverted-button'),
          'button-inverted-hover': withOpacity('--color-text-inverted-button-hover')
        }
      },
      borderColor: {
        brand: {
          base: withOpacity('--color-border')
        }
      },
      backgroundColor: {
        brand: {
          fill: withOpacity('--color-fill'),
          button: withOpacity('--color-button'),
          'button-hover': withOpacity('--color-button-hover')
        }
      },
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
