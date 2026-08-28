import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'release/**',
      'uat/**',
      'public/**',
      'stage11/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
    ],
  },
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}', 'scripts/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-debugger': 'error',
      'no-constant-condition': 'error',
      'no-unreachable': 'error',
      'no-dupe-keys': 'error',
    },
  },
]
