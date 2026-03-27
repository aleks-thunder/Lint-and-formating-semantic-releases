module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // type-enum - commit prefix: "fix(...): ..."
    "type-enum": [
      2, // error level
      "always", // always check
      [
        "feat",
        "fix",
        "chore",
        "docs",
        "ci",
        "refactor",
        "test",
        "style",
        "perf",
        "revert",
      ],
    ],
    "type-case": [2, "always", "lower-case"], // always check and convert to lower case
  },
};
