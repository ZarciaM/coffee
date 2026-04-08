import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    rules: {
      'camelcase': 'off',

      '@typescript-eslint/naming-convention': [
        'error',

        {
          'selector': 'typeLike',
          'format': ['PascalCase'],
        },

        {
          'selector': 'variable',
          'format': ['camelCase', 'UPPER_CASE', 'PascalCase'],
          'leadingUnderscore': 'allow',
        },

        {
          'selector': ['method'],
          'format': ['camelCase'],
        },

        {
          'selector': ['function'],
          'format': ['PascalCase'],
        },


        {
          'selector': 'classProperty',
          'format': ['camelCase'],
        }
      ],


      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    },
  },
])