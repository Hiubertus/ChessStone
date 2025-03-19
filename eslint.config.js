import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import a11yPlugin from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import eslintPluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import prettierConfig from './prettier.config.js';

/* eslint-disable import/no-default-export */
export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.next', 'build', 'public', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react: eslintPluginReact,
      import: importPlugin,
      'jsx-a11y': a11yPlugin,
      prettier: prettier,
    },
    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TypeScript
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
      'react/jsx-props-no-spreading': 'off',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',

      // Import rules
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'error', // Prefer named exports
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // TypeScript rules
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'off', // Allow using the ! operator (non-null assertion)

      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // React Refresh rules
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Prettier rules
      'prettier/prettier': ['error', prettierConfig],

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {},
      },
    },
  },
);
