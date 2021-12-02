module.exports = {
  purge: [
    './src/components/**/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}'
  ],
  mode: 'jit',
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
