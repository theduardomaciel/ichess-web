/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends:["eslint:recommended", "prettier", "eslint-config-turbo"],
  plugins: ['simple-import-sort', "only-warn"],
  rules: {
    'simple-import-sort/imports': 'error',
    camelcase: 'off',
  },
}
