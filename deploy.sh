#!/bin/bash

# OCS Magnetic System Tool - 部署脚本
# 使用方法: ./deploy.sh YOUR_GITHUB_USERNAME

set -e

GITHUB_USERNAME=$1

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ 请提供 GitHub 用户名"
    echo "用法: ./deploy.sh your-github-username"
    exit 1
fi

echo "🚀 OCS Magnetic System Tool 部署脚本"
echo "======================================"

# 1. 推送到 GitHub
echo "📤 步骤 1: 推送到 GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$GITHUB_USERNAME/OCS-Magnetic-System-Tool.git"
git branch -M main
git push -u origin main --force
echo "✅ 已推送到 GitHub"

# 2. 检查 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📥 安装 Vercel CLI..."
    npm i -g vercel
fi

# 3. 部署到 Vercel
echo "🌐 步骤 2: 部署到 Vercel..."
vercel --prod --yes

echo ""
echo "🎉 部署完成！"
echo "GitHub: https://github.com/$GITHUB_USERNAME/OCS-Magnetic-System-Tool"
echo "Vercel: https://ocs-magnetic-system-tool.vercel.app (或查看 CLI 输出)"
