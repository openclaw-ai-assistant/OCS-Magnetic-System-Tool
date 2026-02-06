#!/bin/bash
# One-click deployment script for OCS Magnetic System Tool
# Usage: ./one-click-deploy.sh YOUR_GITHUB_USERNAME

set -e

GITHUB_USERNAME=$1

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ 请提供 GitHub 用户名"
    echo "用法: ./one-click-deploy.sh your-github-username"
    exit 1
fi

echo "🚀 OCS Magnetic System Tool - 一键部署"
echo "======================================="
echo ""

# Check if git is configured
if ! git config --global user.name > /dev/null 2>&1; then
    echo "⚙️  配置 Git..."
    git config --global user.name "OCS Developer"
    git config --global user.email "dev@ocs.com"
fi

# Step 1: Push to GitHub
echo "📤 步骤 1/3: 推送到 GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$GITHUB_USERNAME/OCS-Magnetic-System-Tool.git"
git branch -M main

if git push -u origin main --force; then
    echo "✅ 代码已推送到 GitHub"
    echo "   仓库地址: https://github.com/$GITHUB_USERNAME/OCS-Magnetic-System-Tool"
else
    echo "❌ 推送失败，请检查："
    echo "   1. 是否已在 GitHub 创建仓库"
    echo "   2. GitHub 用户名是否正确"
    echo "   3. 是否有推送权限"
    exit 1
fi

echo ""
echo "📋 下一步：部署到 Vercel"
echo "========================"
echo ""
echo "方法 A: 使用 Vercel CLI（推荐开发者）"
echo "-------------------------------------"
echo "1. 安装 Vercel CLI:"
echo "   npm i -g vercel"
echo ""
echo "2. 登录 Vercel:"
echo "   vercel login"
echo ""
echo "3. 部署:"
echo "   vercel --prod"
echo ""
echo ""
echo "方法 B: 使用 Vercel Web（最简单）"
echo "---------------------------------"
echo "1. 访问: https://vercel.com/new"
echo ""
echo "2. 导入 GitHub 仓库:"
echo "   - 点击 'Import Git Repository'"
echo "   - 选择 '$GITHUB_USERNAME/OCS-Magnetic-System-Tool'"
echo ""
echo "3. 点击 'Deploy'（Vercel 会自动识别 Next.js）"
echo ""
echo "4. 等待 2-3 分钟，获得在线链接"
echo ""
echo ""
echo "✨ 自动部署（推荐）"
echo "-------------------"
echo "项目已配置 GitHub Actions，推送后会自动："
echo "- 运行测试"
echo "- 构建项目"
echo "- 部署到 Vercel（需要配置 Secrets）"
echo ""
echo "配置 Secrets:"
echo "1. 在 GitHub 仓库 → Settings → Secrets and variables → Actions"
echo "2. 添加以下 Secrets:"
echo "   - VERCEL_TOKEN"
echo "   - VERCEL_ORG_ID"
echo "   - VERCEL_PROJECT_ID"
echo ""
echo ""
echo "🎉 完成！"
echo "=========="
echo "GitHub: https://github.com/$GITHUB_USERNAME/OCS-Magnetic-System-Tool"
echo ""
echo "现在请选择一种部署方法完成部署！"
