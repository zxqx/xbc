module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: 'airbnb',
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  rules: {
    'lines-between-class-members': 0,
    'object-curly-newline': 0,
    'no-unused-vars': 0,
    'no-plusplus': 0,
    'import/prefer-default-export': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }
    }
  }
}