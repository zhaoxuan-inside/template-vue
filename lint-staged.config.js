export default {
  '*.{ts,tsx,vue}': ['eslint --fix', 'prettier --write'],
  '*.{js,jsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml}': ['prettier --write']
}
