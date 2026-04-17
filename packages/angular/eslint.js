import baseConfig from "@aleks-thunder/base/eslint";
import angular from "angular-eslint";
import prettierPlugin from "eslint-plugin-prettier";

function scopeAngularTemplateConfigs(configs) {
  return configs.map((c) => {
    if (!c || typeof c !== "object") return c;
    if (c.files) return c;
    return { ...c, files: ["**/*.html"] };
  });
}

export default [
  ...(Array.isArray(baseConfig) ? baseConfig : [baseConfig]),
  ...angular.configs.tsRecommended,
  ...scopeAngularTemplateConfigs(angular.configs.templateRecommended),
  {
    files: ["**/*.ts"],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": ["error", { parser: "angular" }],
      "@angular-eslint/template/attributes-order": [
        "error",
        {
          order: [
            "STRUCTURAL_DIRECTIVE",
            "TEMPLATE_REFERENCE",
            "ATTRIBUTE_BINDING",
            "INPUT_BINDING",
            "TWO_WAY_BINDING",
            "OUTPUT_BINDING",
          ],
          alphabetical: false,
        },
      ],
    },
  },
];
