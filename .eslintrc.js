/*
 * @Author: Innei
 * @Date: 2020-07-22 20:04:41
 * @LastEditTime: 2020-07-22 20:55:34
 * @LastEditors: Innei

 * @FilePath: /mx-player/.eslintrc.js
 * @Coding with Love
 */

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'standard',
    'standard-react',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      legacyDecorators: true,
      jsx: true,
    },
  },
  settings: {
    react: {
      version: '16',
    },
  },
  rules: {
    'space-before-function-paren': 0,
    'react/prop-types': 0,
    'react/jsx-handler-names': 0,
    'react/jsx-fragments': 0,
    'react/no-unused-prop-types': 0,
    'import/export': 0,
    'no-unused-vars': 'off',
  },
}
