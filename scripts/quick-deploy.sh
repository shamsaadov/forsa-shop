#!/bin/bash

# Скрипт для быстрого деплоя на сервер
# Использование: ./scripts/quick-deploy.sh "commit message"

set -e

COMMIT_MSG="${1:-Quick deploy $(date '+%Y-%m-%d %H:%M:%S')}"

echo "🚀 Quick Deploy Script"
echo "Commit message: $COMMIT_MSG"
echo ""

# Проверяем, что мы в git репозитории
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Проверяем статус git
echo "📋 Checking git status..."
git status --porcelain

# Добавляем все изменения
echo "📦 Adding changes..."
git add .

# Коммитим изменения
echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG" || echo "No changes to commit"

# Пушим в main
echo "📤 Pushing to main branch..."
git push origin main

echo ""
echo "✅ Deploy initiated!"
echo "🔍 Check GitHub Actions: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\)\.git/\1/')/actions"
echo "🌐 Site will be updated in ~2-3 minutes: https://forsa-potolki.ru"
echo ""
echo "💡 You can also run manual deployment from GitHub Actions tab"
