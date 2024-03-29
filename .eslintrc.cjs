module.exports = {
  root: true
, parser: '@typescript-eslint/parser'
, plugins: [
    '@typescript-eslint'
  ]
, extends: [
    'eslint:recommended'
  , 'plugin:@typescript-eslint/recommended'
  ]
, rules: {
    'no-constant-condition': 'off'
  , 'no-async-promise-executor': 'off'
  , 'no-inner-declarations': 'off'
  , '@typescript-eslint/no-inferrable-types': 'off'
  , '@typescript-eslint/ban-types': 'off'
  , '@typescript-eslint/ban-ts-comment': 'off'
  , '@typescript-eslint/no-var-requires': 'off'
  }
}
