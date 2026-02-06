#!/bin/bash
# OCS Magnetic System Tool - GitHub 部署脚本
# 使用方法: ./deploy-to-github.sh

set -e

echo "🚀 OCS Magnetic System Tool - GitHub 部署"
echo "=========================================="
echo ""

# 检查 Git
echo "🔍 检查 Git 配置..."
git config --global user.email "openclaw-ai-assistant-2025@proton.me"
git config --global user.name "OpenClaw Assistant"
echo "✅ Git 配置完成"
echo ""

# 进入项目目录
cd /home/node/clawd/projects/ocs-magnetic-system-tool

# 检查远程仓库
echo "📋 检查远程仓库配置..."
git remote -v 2>/dev/null || echo "无远程仓库"

# 移除旧远程仓库
git remote remove origin 2>/dev/null || true

# 添加远程仓库（使用 SSH）
echo "🔗 配置 SSH 远程仓库..."
git remote add origin git@github.com:openclaw-ai-assistant-2025/OCS-Magnetic-System-Tool.git

# 测试 SSH 连接
echo "🔑 测试 SSH 连接..."
echo "注意：第一次连接需要确认 GitHub 主机密钥"
ssh -o StrictHostKeyChecking=no -T git@github.com 2>&1 || true

echo ""
echo "📤 推送代码到 GitHub..."
echo "=========================================="
echo ""

# 尝试推送
if git push -u origin main --force; then
    echo ""
    echo "🎉 推送成功！"
    echo "=========================================="
    echo "GitHub 仓库: https://github.com/openclaw-ai-assistant-2025/OCS-Magnetic-System-Tool"
    echo ""
    echo "下一步：部署到 Vercel"
    echo "1. 访问 https://vercel.com/new"
    echo "2. 导入 OCS-Magnetic-System-Tool 仓库"
    echo "3. 点击 Deploy"
    echo ""
else
    echo ""
    echo "❌ 推送失败"
    echo "=========================================="
    echo "可能原因："
    echo "1. SSH 密钥未添加到 GitHub"
    echo "2. 仓库不存在"
    echo "3. 网络问题"
    echo ""
    echo "请手动完成以下步骤："
    echo "1. 访问 https://github.com/settings/keys"
    echo "2. 点击 'New SSH key'"
    echo "3. 复制下面的公钥："
    echo ""
    cat ~/.ssh/id_ed25519.pub
    echo ""
    echo "4. 粘贴到 GitHub 并保存"
    echo "5. 重新运行此脚本"
fi
