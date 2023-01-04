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

  parserOptions: {
    ecmaVersion: "latest",
  },

  rules: {
    semi: "off",
    "@typescript-eslint/semi": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
