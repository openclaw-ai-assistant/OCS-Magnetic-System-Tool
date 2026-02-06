# OCS Magnetic System Tool - 快速部署指南

## 🚀 方案一：GitHub + Vercel（推荐）

### 步骤 1：在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 填写信息：
   - Repository name: `OCS-Magnetic-System-Tool`
   - Description: `Advanced magnetic sensor simulation and design platform`
   - Visibility: **Public**
   - ❌ 不要勾选 "Add a README file"
   - ❌ 不要勾选 "Add .gitignore"
   - ❌ 不要勾选 "Choose a license"
3. 点击 **Create repository**

### 步骤 2：推送代码

创建仓库后，复制以下命令并执行：

```bash
cd /home/node/clawd/projects/ocs-magnetic-system-tool

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/OCS-Magnetic-System-Tool.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤 3：部署到 Vercel

#### 方法 A：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署
vercel --prod
```

#### 方法 B：使用 Vercel Web 界面（更简单）

1. 访问 https://vercel.com/new
2. 点击 **Import Git Repository**
3. 选择你的 `OCS-Magnetic-System-Tool` 仓库
4. Vercel 会自动检测 Next.js 项目
5. 点击 **Deploy**

等待 2-3 分钟，部署完成后会获得一个类似 `https://ocs-magnetic-system-tool.vercel.app` 的 URL。

---

## 🐳 方案二：Docker 部署

如果需要在本地或服务器运行，可以使用 Docker：

### 创建 Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 构建和运行

```bash
# 构建镜像
docker build -t ocs-magnetic-tool .

# 运行容器
docker run -p 3000:3000 ocs-magnetic-tool
```

---

## 🔧 解决依赖问题

如果在 `npm install` 时遇到问题，尝试以下方法：

### 方法 1：清除缓存
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 方法 2：使用 Yarn
```bash
npm install -g yarn
yarn install
yarn build
```

### 方法 3：手动安装缺失依赖
```bash
npm install -D tailwindcss@3.3.6 postcss autoprefixer
npm install clsx tailwind-merge class-variance-authority
```

---

## ✅ 本地测试

```bash
cd /home/node/clawd/projects/ocs-magnetic-system-tool

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 打开浏览器访问 http://localhost:3000
```

---

## 📁 项目文件说明

```
ocs-magnetic-system-tool/
├── app/                    # Next.js 应用
│   ├── globals.css        # 全局样式（Tailwind）
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页
├── components/            # 组件
│   ├── MagneticTool.tsx   # 主工具组件
│   ├── layout/           # 布局组件
│   │   ├── Sidebar.tsx   # 左侧导航
│   │   ├── Canvas3D.tsx  # 3D 可视化
│   │   └── ResultsPanel.tsx
│   └── simulation/       # 仿真组件
│       └── QuickSimButton.tsx
├── lib/                  # 工具库
│   ├── simulation/       # 磁场计算引擎
│   │   └── magnetic-field.ts
│   ├── database/         # 传感器数据
│   │   └── sensors.ts
│   └── utils/           # 工具函数
├── store/               # Zustand 状态管理
│   └── toolStore.ts
├── types/              # TypeScript 类型
│   └── index.ts
├── package.json        # 依赖配置
├── tailwind.config.ts  # Tailwind 配置
├── postcss.config.js   # PostCSS 配置
├── tsconfig.json       # TypeScript 配置
└── README.md           # 项目说明
```

---

## 🌟 功能特性

- ✅ **传感器选择**：MagAlpha & MagVector 家族
- ✅ **3D 可视化**：Three.js 实时预览传感器和磁铁
- ✅ **仿真计算**：磁场、角度误差、SNR 计算
- ✅ **结果图表**：误差曲线、Sin/Cos 波形
- ✅ **预设模板**：4个常用配置模板
- ✅ **响应式 UI**：深色主题、现代化界面

---

## 🆘 常见问题

### Q: npm install 失败？
A: 尝试使用 `yarn` 替代，或清除 npm 缓存后重试。

### Q: 构建失败？
A: 确保所有依赖已正确安装，特别是 `tailwindcss` 和 `typescript`。

### Q: 如何更新项目？
A: 修改代码后执行：
```bash
git add .
git commit -m "更新描述"
git push origin main
```
Vercel 会自动重新部署。

---

## 🎉 恭喜！

部署完成后，你将拥有一个完整的磁传感器仿真工具！

- **GitHub 仓库**：托管代码
- **Vercel 部署**：在线访问
- **本地开发**：实时调试

需要进一步帮助？请查看 `README.md` 或 `DEVELOPMENT_SUMMARY.md`。
