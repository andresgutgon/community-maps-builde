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
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
