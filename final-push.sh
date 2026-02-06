#!/bin/bash
# OCS Magnetic System Tool - 最终推送脚本
# 使用方法: ./final-push.sh

set -e

echo "🚀 OCS Magnetic System Tool - 最终推送"
echo "========================================"
echo ""

# 1. 确保SSH配置正确
echo "🔧 步骤 1: 配置SSH..."
export HOME=/root
if [ ! -f /root/.ssh/id_ed25519 ]; then
    echo "❌ SSH密钥不存在"
    echo "请确保密钥已添加到 /root/.ssh/"
    exit 1
fi

# 启动SSH代理
eval "$(ssh-agent -s)" > /dev/null
ssh-add /root/.ssh/id_ed25519 > /dev/null 2>&1
echo "✅ SSH代理已启动"

# 2. 进入项目目录
cd /home/node/clawd/projects/ocs-magnetic-system-tool

# 3. 配置Git
git config user.name "OpenClaw Assistant"
git config user.email "openclaw-ai-assistant-2025@proton.me"

# 4. 配置远程仓库（SSH方式）
echo "🔗 步骤 2: 配置远程仓库..."
git remote remove origin 2>/dev/null || true
git remote add origin git@github.com:openclaw-ai-assistant-2025/OCS-Magnetic-System-Tool.git
echo "✅ 远程仓库已配置"

# 5. 测试SSH连接
echo "🔍 步骤 3: 测试SSH连接..."
if ssh -o BatchMode=yes -o ConnectTimeout=5 git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ SSH认证成功"
else
    echo "⚠️  SSH测试未返回成功，但仍会尝试推送..."
fi

# 6. 推送代码
echo ""
echo "📤 步骤 4: 推送到GitHub..."
echo "========================================"

if git push -u origin main --force; then
    echo ""
    echo "🎉 推送成功！"
    echo "========================================"
    echo "GitHub仓库: https://github.com/openclaw-ai-assistant-2025/OCS-Magnetic-System-Tool"
    echo ""
    echo "下一步：部署到Vercel"
    echo "1. 访问 https://vercel.com/new"
    echo "2. 导入 OCS-Magnetic-System-Tool 仓库"
    echo "3. 点击 Deploy"
    exit 0
else
    echo ""
    echo "❌ 推送失败"
    echo "========================================"
    echo ""
    echo "可能原因："
    echo "1. GitHub仓库不存在（需要先创建）"
    echo "2. SSH密钥未添加到GitHub账户"
    echo "3. 网络问题"
    echo ""
    echo "解决方案："
    echo ""
    echo "方案A - 手动创建仓库："
    echo "1. 访问 https://github.com/new"
    echo "2. 创建名为 OCS-Magnetic-System-Tool 的仓库"
    echo "3. 保持为空（不添加README）"
    echo "4. 重新运行此脚本"
    echo ""
    echo "方案B - 使用压缩包上传："
    echo "项目已打包：/home/node/clawd/OCS-Magnetic-System-Tool-Complete.tar.gz"
    echo "解压后手动上传到GitHub"
    echo ""
    exit 1
fi
