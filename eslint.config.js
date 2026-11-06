import tsParser from '@typescript-eslint/parser'
import tsdoc from 'eslint-plugin-tsdoc'
import { defaultTypescriptRules } from '@scaleway/eslint-config-react/typescript'

export default [
  ...defaultTypescriptRules,
  {
    settings: {
      react: {
        version: '18.0',
      },
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      tsdoc,
    },
    rules: {
      'tsdoc/syntax': 'warn',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
      ],
      'import/no-default-export': 'error',
      '@typescript-eslint/no-namespace': 'off',
    },
  },
]
