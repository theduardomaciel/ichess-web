/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@theduardomaciel/eslint-config/next', 'next/core-web-vitals'],
  plugins: [],
  rules: {
    camelcase: 'off',
  },
}
