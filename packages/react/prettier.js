import basePrettier from "@aleks-thunder/base/prettier";

/** React preset: Tailwind class sorting + Prettier options that differ from base. */
export default {
  ...basePrettier,
  trailingComma: "es5",
  arrowParens: "always",
  endOfLine: "lf",
  singleAttributePerLine: true,
  plugins: ["prettier-plugin-tailwindcss"],
};
// test commit
