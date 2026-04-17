/** Shared Prettier defaults for all presets (framework-specific `overrides` stay in angular/react). */
export default {
  semi: true,
  singleQuote: true,
  trailingComma: "all",
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: "avoid",
  bracketSameLine: false,
  plugins: ["prettier-plugin-multiline-arrays"],
  multilineArraysWrapThreshold: 2,
};
// test comment line
