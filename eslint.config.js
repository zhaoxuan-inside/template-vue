import js from '@eslint/js'
import globals from 'globals'
import vue from 'eslint-plugin-vue'
import typescript from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import boundaries from 'eslint-plugin-boundaries'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.git/**',
      '.husky/**',
      'src/auto-imports.d.ts',
      'src/components.d.ts',
      'src/test/**',
    ],
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettierConfig,
  {
    files: ['**/*.vue', '**/*.{ts,tsx}'],
    plugins: {
      vue,
      '@typescript-eslint': typescript,
      prettier,
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'pages', pattern: 'src/pages/**' },
        { type: 'widgets', pattern: 'src/widgets/**' },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'entities', pattern: 'src/entities/**' },
        { type: 'shared', pattern: 'src/shared/**' },
      ],
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vue.parser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      'vue/multi-word-component-names': 'warn',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: { max: 5 },
          multiline: { max: 1 },
        },
      ],
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: { element: { types: 'app' } },
              allow: {
                element: {
                  types: { anyOf: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'] },
                },
              },
            },
            {
              from: { element: { types: 'pages' } },
              allow: {
                element: {
                  types: { anyOf: ['pages', 'widgets', 'features', 'entities', 'shared'] },
                },
              },
            },
            {
              from: { element: { types: 'widgets' } },
              allow: {
                element: { types: { anyOf: ['widgets', 'features', 'entities', 'shared'] } },
              },
            },
            {
              from: { element: { types: 'features' } },
              allow: { element: { types: { anyOf: ['features', 'entities', 'shared'] } } },
            },
            {
              from: { element: { types: 'entities' } },
              allow: { element: { types: { anyOf: ['entities', 'shared'] } } },
            },
            {
              from: { element: { types: 'shared' } },
              allow: { element: { types: 'shared' } },
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: resolve(__dirname, 'tsconfig.eslint.json'),
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: { element: { types: 'app' } },
              allow: {
                element: {
                  types: { anyOf: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'] },
                },
              },
            },
            {
              from: { element: { types: 'pages' } },
              allow: {
                element: {
                  types: { anyOf: ['pages', 'widgets', 'features', 'entities', 'shared'] },
                },
              },
            },
            {
              from: { element: { types: 'widgets' } },
              allow: {
                element: { types: { anyOf: ['widgets', 'features', 'entities', 'shared'] } },
              },
            },
            {
              from: { element: { types: 'features' } },
              allow: { element: { types: { anyOf: ['features', 'entities', 'shared'] } } },
            },
            {
              from: { element: { types: 'entities' } },
              allow: { element: { types: { anyOf: ['entities', 'shared'] } } },
            },
            {
              from: { element: { types: 'shared' } },
              allow: { element: { types: 'shared' } },
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.spec.ts'],
    languageOptions: {
      globals: {
        describe: true,
        it: true,
        expect: true,
        vi: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
]
