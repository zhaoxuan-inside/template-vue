#!/bin/bash

EXTENSIONS=(
  "Vue.volar"
  "dbaeumer.vscode-eslint"
  "esbenp.prettier-vscode"
  "gruntfuggly.todo-tree"
  "bradlc.vscode-tailwindcss"
  "eamodio.gitlens"
  "formulahendry.auto-rename-tag"
)

echo "=== 安装团队推荐扩展 ==="

for ext in "${EXTENSIONS[@]}"; do
  echo "正在安装: $ext"
  code --install-extension "$ext" --force
done

echo ""
echo "=== 扩展安装完成 ==="
