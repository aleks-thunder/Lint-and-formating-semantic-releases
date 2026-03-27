module.exports = {
  ...require("@aleks-thunder/base/prettier"),
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  semi: true,
  bracketSpacing: true,
  arrowParens: "avoid",
  trailingComma: "all",
  bracketSameLine: false,
  printWidth: 100,
  plugins: ["prettier-plugin-multiline-arrays"],
  multilineArraysWrapThreshold: 2,
  overrides: [
    {
      files: "*.html",
      options: {
        parser: "angular",
        singleAttributePerLine: true,
      },
    },
  ],
};
