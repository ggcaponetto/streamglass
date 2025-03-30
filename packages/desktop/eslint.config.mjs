import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import eslintConfigPrettier from "eslint-config-prettier/flat";

const configBase = tseslint.config(
  {
    ignores: ['dist', 'coverage', 'html', "out", "/.vite", "node_modules"],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules,
      ...tseslint.configs.recommended[1].rules,
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.electron?.rules,
      ...importPlugin.configs.typescript?.rules,
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  }
)

export default [
  ...configBase,
  eslintConfigPrettier
]
