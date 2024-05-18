module.exports = {
  'apps/**/*.{js,ts,jsx,tsx}': ['eslint --fix'],
  'packages/ui/**/*.{js,ts,jsx,tsx}': ['eslint --fix'],
  '**/*.{js,ts,tsx,json,css,md}': ['prettier --write'],
}
