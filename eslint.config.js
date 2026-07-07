import js from '@eslint/js'
import globals from 'globals'
import vue from 'eslint-plugin-vue'
import typescript from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettierConfig,
  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      vue,
      typescript,
      prettier
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
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
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: { max: 5 },
          multiline: { max: 1 }
        }
      ]
    }
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      prettier
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  {
    ignores: ['node_modules/**', 'dist/**', '.git/**', '*.config.js']
  }
]
