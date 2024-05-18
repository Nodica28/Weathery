module.exports = {
  env: { browser: true, es2021: true },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'prettier', 'unused-imports'],
  rules: {
    'prettier/prettier': ['error', { usePrettierrc: true }],
    'unused-imports/no-unused-imports': 'error',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
}
