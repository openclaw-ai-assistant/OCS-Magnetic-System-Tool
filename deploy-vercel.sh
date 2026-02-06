#!/bin/bash
# Vercel 部署脚本 - 使用方法: ./deploy-vercel.sh

echo "🚀 OCS Magnetic System Tool - Vercel 部署"
echo "=========================================="
echo ""

# 检查是否已登录 Vercel
if ! vercel whoami > /dev/null 2>&1; then
    echo "🔑 需要登录 Vercel..."
    echo "请在浏览器中完成授权，然后返回这里继续"
    echo ""
    vercel login
fi

echo ""
echo "🌐 开始部署..."
cd /home/node/clawd/projects/ocs-magnetic-system-tool

# 部署到 Vercel
vercel --prod --yes

echo ""
echo "✅ 部署完成！"
echo "检查上面的输出获取访问链接"
