module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'arrow-parens': 0,
    'global-require': 0,
    'react/no-danger': 0,
    'react/prop-types': 0,
    'object-curly-newline': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'implicit-arrow-linebreak': 0,
    'jsx-a11y/accessible-emoji': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-one-expression-per-line': 0,
  },
};
