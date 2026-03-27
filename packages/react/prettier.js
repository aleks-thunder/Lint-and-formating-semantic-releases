module.exports = {
  ...require("@aleks-thunder/base/prettier"),
  semi: true,
  trailingComma: "es5",
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 120,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf",
  singleAttributePerLine: true,
  multilineArraysWrapThreshold: 2,
  plugins: [
    "prettier-plugin-multiline-arrays",
    // Tailwind specific formatting.
    "prettier-plugin-tailwindcss",
  ],
};
