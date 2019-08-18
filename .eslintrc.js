module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
