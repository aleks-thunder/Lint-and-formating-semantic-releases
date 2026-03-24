module.exports = {
  root: true,
  env: {
    es2023: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  extends: ["eslint:recommended"],
  ignorePatterns: ["dist", "build", "coverage"]
};
