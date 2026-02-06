#!/bin/bash
# OCS Magnetic System Tool Auto-Deployment
# This script will create GitHub repo and deploy to Vercel

set -e

echo "🚀 OCS Magnetic System Tool - 自动部署"
echo "========================================"
echo ""

# Get GitHub username
read -p "请输入你的 GitHub 用户名: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub 用户名不能为空"
    exit 1
fi

# Get GitHub Token
read -s -p "请输入 GitHub Personal Access Token (需要 repo 权限): " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GitHub Token 不能为空"
    echo ""
    echo "如何获取 Token:"
    echo "1. 访问 https://github.com/settings/tokens"
    echo "2. 点击 'Generate new token (classic)'"
    echo "3. 勾选 'repo' 权限"
    echo "4. 生成并复制 token"
    exit 1
fi

echo ""
echo "📤 步骤 1: 在 GitHub 创建仓库..."

# Create GitHub repo using API
curl_response=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"OCS-Magnetic-System-Tool\",\"description\":\"Advanced magnetic sensor simulation and design platform\",\"private\":false}")

if [ "$curl_response" = "201" ]; then
    echo "✅ GitHub 仓库创建成功"
elif [ "$curl_response" = "422" ]; then
    echo "⚠️  仓库可能已存在，继续推送代码..."
else
    echo "❌ 创建仓库失败 (HTTP $curl_response)"
    exit 1
fi

echo ""
echo "📤 步骤 2: 推送代码到 GitHub..."

cd /home/node/clawd/projects/ocs-magnetic-system-tool

# Configure remote
git remote remove origin 2>/dev/null || true
git remote add origin "https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/OCS-Magnetic-System-Tool.git"

# Push code
if git push -u origin main --force; then
    echo "✅ 代码推送成功"
    echo "   仓库地址: https://github.com/$GITHUB_USERNAME/OCS-Magnetic-System-Tool"
else
    echo "❌ 推送失败"
    exit 1
fi

echo ""
echo "🌐 步骤 3: 部署到 Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 安装 Vercel CLI..."
    npm install -g vercel
fi

echo "⚠️  需要在浏览器中完成 Vercel 授权"
echo ""
read -p "按 Enter 键继续部署到 Vercel..."

# Deploy to Vercel
vercel --prod --yes

echo ""
echo "🎉 部署完成！"
echo "=============="
echo "GitHub: https://github.com/$GITHUB_USERNAME/OCS-Magnetic-System-Tool"
echo ""
echo "你的应用应该已经部署到 Vercel 了！"
echo "如果 Vercel 部署成功，上面会显示访问链接。"
