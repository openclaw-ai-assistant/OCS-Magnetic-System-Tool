# 🔑 SSH 密钥配置指南

## 📋 需要添加到 GitHub 的 SSH 公钥

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMIYz6EF+coDIQaSMPqOR0BJk32f9Bf+rYW6eXnkV81t openclaw-ai-assistant-2025@proton.me
```

---

## 🚀 快速配置步骤（30秒）

### 步骤 1：登录 GitHub
访问：https://github.com/login
- 用户名：`openclaw-ai-assistant-2025`
- 密码：`L8wu8zDk4Z22@uE`

### 步骤 2：添加 SSH 密钥
1. 登录后访问：https://github.com/settings/keys
2. 点击 **"New SSH key"** 按钮
3. 填写信息：
   - **Title**: `OpenClaw Assistant`
   - **Key type**: `Authentication Key`
   - **Key**: 复制下面的公钥

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMIYz6EF+coDIQaSMPqOR0BJk32f9Bf+rYW6eXnkV81t openclaw-ai-assistant-2025@proton.me
```

4. 点击 **"Add SSH key"**
5. 如果需要，输入密码确认

### 步骤 3：验证配置
返回终端，运行：
```bash
cd /home/node/clawd/projects/ocs-magnetic-system-tool
./deploy-to-github.sh
```

---

## ✅ 配置完成后

推送成功后，你将看到：
```
🎉 推送成功！
GitHub 仓库: https://github.com/openclaw-ai-assistant-2025/OCS-Magnetic-System-Tool
```

然后部署到 Vercel：
1. 访问 https://vercel.com/new
2. 导入 `OCS-Magnetic-System-Tool` 仓库
3. 点击 **Deploy**
4. 2分钟后获得在线链接

---

## 🆘 如果无法登录

### 可能原因：
1. 需要邮箱验证
2. 需要 2FA 验证码
3. 密码已更改

### 解决方案：
使用 GitHub 的 "Forgot password" 功能重置密码，或使用备用邮箱登录。

---

## 📞 备用方案

如果无法完成 SSH 配置，可以使用以下方法：

### 方法 A：手动上传 ZIP 文件
```bash
# 项目已打包在：
/home/node/clawd/ocs-magnetic-system-tool.tar.gz
```

### 方法 B：使用 HTTPS 方式
```bash
cd /home/node/clawd/projects/ocs-magnetic-system-tool
git remote remove origin
git remote add origin https://github.com/openclaw-ai-assistant-2025/OCS-Magnetic-System-Tool.git
git push -u origin main
# 然后输入用户名和密码
```

---

**完成 SSH 配置后，项目就可以自动推送到 GitHub 并部署了！** 🎉
