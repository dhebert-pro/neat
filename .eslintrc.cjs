/* eslint-env node */

require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,

  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  plugins: ["import"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    semi: "off",
    "@typescript-eslint/semi": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-restricted-imports": [
      "error",
      {
        patterns: [".*"],
      },
    ],
    "import/order": [
      "error",
      {
        alphabetize: {
          caseInsensitive: true,
          order: "asc",
        },
        groups: ["external", "builtin", "parent", ["sibling", "index"]],
        "newlines-between": "never",
        pathGroups: [
          {
            group: "external",
            pattern: "react",
            position: "before",
          },
          {
            group: "external",
            pattern: "@my_org/**",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
      },
    ],
  },
};
