import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'example'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node, ...globals.jest } },
    settings: { react: { version: 'detect' } },
    rules: { 'react/prop-types': 'off' }
  }
);
