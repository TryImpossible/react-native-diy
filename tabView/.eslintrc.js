module.exports = {
  root: true,
  extends: ["@react-native-community", "plugin:react-hooks/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-hooks"],
  globals: {},
  rules: {
    // 禁止使用 var
    "no-var": "error",
    // 优先使用 interface 而不是 type
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    // https://github.com/typescript-eslint/typescript-eslint/blob/v2.28.0/packages/eslint-plugin/docs/rules/no-unused-vars.md
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    // 不允许使用行内样式
    "react-native/no-inline-styles": 0,
  },
};
