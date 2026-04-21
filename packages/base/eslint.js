import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default defineConfig({
  files: ["**/*.{ts,tsx,js,jsx}"],
  plugins: {
    "unused-imports": unusedImports,
    "simple-import-sort": simpleImportSort,
    prettier: prettierPlugin,
  },
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,
    eslintConfigPrettier,
  ],
  rules: {
    "@typescript-eslint/member-ordering": [
      "error",
      {
        default: [
          // inject() dependencies — private/protected readonly instance fields (FIRST)
          "private-instance-readonly-field",
          "protected-instance-readonly-field",
          // Angular Inputs/Outputs (decorated fields FIRST)
          "public-decorated-field",
          "protected-decorated-field",
          "private-decorated-field",
          // Public fields (observables, form controls, etc.)
          "public-instance-field",
          "public-static-field",
          // Private/protected fields
          "protected-instance-field",
          "private-instance-field",
          // Constructor (AFTER properties)
          "constructor",
          // Lifecycle hooks (e.g. ngOnInit, ngOnChanges)
          "public-instance-method",
          // Public methods
          "public-static-method",
          // Private/protected methods
          "protected-instance-method",
          "private-instance-method",
        ],
      },
    ],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "enum",
        format: ["PascalCase"],
      },
      {
        selector: "enumMember",
        format: ["PascalCase", "UPPER_CASE"],
      },
    ],
    "lines-between-class-members": [
      "error",
      {
        enforce: [
          { blankLine: "always", prev: "method", next: "method" },
          { blankLine: "always", prev: "method", next: "field" },
          { blankLine: "always", prev: "field", next: "method" },
        ],
      },
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "prettier/prettier": "error",
    "prefer-const": "error",
    "no-unused-expressions": "error",
    "no-duplicate-imports": "error",
    "object-shorthand": "warn",
    "unused-imports/no-unused-imports": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
});
