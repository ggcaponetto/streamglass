import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import eslintConfigPrettier from "eslint-config-prettier/flat";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const configBase = tseslint.config(
  {
    ignores: ['dist', 'coverage', 'html', "out", "/.vite"],
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
        project: [
          './tsconfig.json'
        ],
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: [
            './tsconfig.json',
            '../../packages/*/tsconfig.json'
          ]
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          moduleDirectory: [
            'node_modules',
            path.resolve(__dirname, '../../node_modules')
          ],
        }
      }
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
    }
  }
)

export default [
  ...configBase,
  eslintConfigPrettier
]
