module.exports = {
  purge: [
    './src/components/**/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}'
  ],
  mode: 'jit',
  theme: {
    extend: {
      borderRadius: {
        inherit: 'inherit'
      },
      outline: {
        white: '2px solid rgba(255, 255, 255, 0.5)',
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
