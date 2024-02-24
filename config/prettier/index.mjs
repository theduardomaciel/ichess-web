/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */

/** @type { PrettierConfig } */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindConfig: "../../apps/web/tailwind.config.js",
  useTabs: true,
  tabSize: 4
}

export default config