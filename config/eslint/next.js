/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [ "eslint:recommended",
  "prettier",
  "eslint-config-turbo", 'next/core-web-vitals'],
  plugins: ['simple-import-sort', "only-warn"],
  rules: {
    'simple-import-sort/imports': 'error',
    camelcase: 'off',
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
  ],
  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
}
