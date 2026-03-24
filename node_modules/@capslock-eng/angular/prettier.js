module.exports = {
  ...require("@testlock-eng/base/prettier"),
  overrides: [
    {
      files: "*.html",
      options: {
        parser: "angular",
      },
    },
  ],
};
