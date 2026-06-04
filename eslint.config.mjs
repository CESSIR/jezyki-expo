/**
 * @fileoverview Konfiguracja ESLint dla WeatherNow.
 *
 * Używamy nowego formatu eslint.config.mjs.
 * Wtyczki obejmują TypeScript, React, Hooks i Prettier.
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
   * Ignorowane pliki (np. node_modules, buildy).
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
   * Reguły TypeScript-ESLint (zalecane).
   */
  ...tseslint.configs.recommended,

  /** Wyłączenie reguł konfliktujących z Prettier */
  prettierConfig,

  /**
   * Główna konfiguracja dla plików TS/TSX.
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
        /** Wykrywanie wersji Reacta z package.json */
        version: 'detect',
      },
    },
    rules: {
      /**
       * Błędy formatowania jako ostrzeżenia (Prettier).
       */
      'prettier/prettier': 'warn',

      /**
       * Wyłączenie wymogu importu Reacta w JSX (od React 17+).
       */
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      /**
       * Restrykcyjne sprawdzanie Hooków.
       */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /**
       * Zezwolenie na nieużywane zmienne z prefiksem _.
       */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      /**
       * Ostrzeżenie przy użyciu explicit 'any'.
       */
      '@typescript-eslint/no-explicit-any': 'warn',

      /**
       * Zezwolenie na importy require().
       */
      '@typescript-eslint/no-require-imports': 'off',

      /**
       * Ogólna jakość kodu.
       */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  /**
   * Konfiguracja dla plików Node.js (np. babel.config.js, metro.config.js).
   */
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  }
);
