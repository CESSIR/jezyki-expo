/**
 * @fileoverview ESLint Flat Configuration for WeatherNow (Expo + TypeScript).
 *
 * WHY flat config? ESLint 9 deprecates .eslintrc in favor of eslint.config.mjs.
 * Using the new format ensures forward compatibility and avoids deprecation warnings.
 *
 * WHY these specific plugins?
 * - typescript-eslint: Provides type-aware linting rules that catch bugs
 *   the TypeScript compiler alone won't flag (e.g., floating promises, unsafe any).
 * - eslint-plugin-react: Enforces React best practices (hooks rules, key props, etc.).
 * - eslint-plugin-react-hooks: Validates the Rules of Hooks (exhaustive-deps, etc.).
 * - eslint-config-prettier: Disables ESLint formatting rules that would conflict with Prettier.
 * - eslint-plugin-prettier: Runs Prettier as an ESLint rule so formatting issues surface as lint errors.
 */
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default tseslint.config(
  /**
   * Global ignore patterns.
   * WHY? node_modules, build artifacts, and generated files should never be linted.
   */
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.expo/**',
      'ios/**',
      'android/**',
      'scripts/**',
      'expo-env.d.ts',
    ],
  },

  /** Base ESLint recommended rules (JavaScript) */
  js.configs.recommended,

  /**
   * TypeScript-ESLint recommended rules.
   * WHY "recommended" instead of "strict"? Strict mode can be too aggressive for a
   * React Native project where some patterns (e.g., style objects) naturally use `any`.
   * We enable specific strict rules individually where they add clear value.
   */
  ...tseslint.configs.recommended,

  /** Disable ESLint rules that conflict with Prettier */
  prettierConfig,

  /**
   * Main configuration for all TypeScript/TSX source files.
   */
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        /** React Native global types */
        __DEV__: 'readonly',
        fetch: 'readonly',
        RequestInit: 'readonly',
        Response: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        /** WHY 'detect'? Automatically reads the React version from package.json. */
        version: 'detect',
      },
    },
    rules: {
      /**
       * === Prettier Integration ===
       * WHY "warn" instead of "error"? Formatting issues shouldn't block development
       * but should be visible. CI pipeline can treat warnings as errors separately.
       */
      'prettier/prettier': 'warn',

      /**
       * === React Rules ===
       * WHY disable react/react-in-jsx-scope? React 17+ JSX transform doesn't require
       * React to be in scope. Expo SDK 56 uses React 19.
       */
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      /**
       * === React Hooks Rules ===
       * WHY "error"? Violating the Rules of Hooks causes runtime crashes that are
       * extremely difficult to debug. These must be hard errors.
       */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /**
       * === TypeScript Rules ===
       * WHY allow unused vars with underscore prefix? This is a common convention for
       * intentionally unused parameters (e.g., _event in handlers).
       */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      /**
       * WHY warn on explicit `any`? Using `any` defeats the purpose of TypeScript.
       * Set to "warn" to allow gradual migration without blocking development.
       */
      '@typescript-eslint/no-explicit-any': 'warn',

      /**
       * WHY disable no-require-imports? Some Expo/React Native modules and asset
       * imports (e.g., images) still use require() syntax.
       */
      '@typescript-eslint/no-require-imports': 'off',

      /**
       * === General Code Quality ===
       */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
);
