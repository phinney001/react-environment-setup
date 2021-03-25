module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    semi: 0,
    'no-fallthrough': 0,
    'no-return-assign': 0,
    'no-param-reassign': 0,
    'no-useless-escape': 0,
    'prefer-destructuring': 0,
    'no-unneeded-ternary': 0,
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: false,
      },
    ],
    '@typescript-eslint/consistent-type-imports': 0,
    '@typescript-eslint/no-unused-expressions': 0,
  },
};
