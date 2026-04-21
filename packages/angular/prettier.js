import basePrettier from "@aleks-thunder/base/prettier";

export default {
  ...basePrettier,
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
// test commit
