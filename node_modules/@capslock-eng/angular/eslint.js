module.exports = {
  extends: [require.resolve("@testlock-eng/base/eslint")],
  parserOptions: {
    project: false,
  },
  ignorePatterns: ["dist", "build"],
};
