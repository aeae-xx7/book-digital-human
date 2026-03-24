# 📚 纸上相遇 (Meet Between Pages)

> 一个基于 AI 的沉浸式互动阅读体验平台，让书中的角色“活”过来，与你展开跨越时空的对话与互动。

## ✨ 核心功能 (Features)

本项目通过结合大语言模型（LLM）能力，为读者提供多维度的书籍互动体验：

- 💬 **角色对话 (Character Chat)**：与书中的经典角色进行深度对话，探讨剧情或寻求建议。
- 👁️ **书眼看你 (Book Sees You)**：AI 根据你的阅读偏好和性格，生成书中角色对你的独特视角和评价。
- 🎭 **角色测试 (Role Test)**：通过互动问答，测试你的性格最契合书中的哪个角色。
- 🤝 **一起做一件事 (Do One Thing)**：设定一个情境，与书中的虚拟角色共同经历一段小故事或完成一个任务。
- 📖 **书籍解析 (Book Analysis)**：智能提取书籍核心思想、人物图谱与名言金句。

## 🛠️ 技术栈 (Tech Stack)

- **框架**: [Next.js 14](https://nextjs.org/) (App Router)
- **前端**: React 18, [Tailwind CSS](https://tailwindcss.com/) (样式)
- **动画**: [Framer Motion](https://www.framer.com/motion/) (丝滑的页面与组件过渡动画)
- **AI 接口**: OpenAI API (驱动角色对话与智能分析)
- **图标**: [Lucide React](https://lucide.dev/)

## 🚀 本地运行 (Getting Started)

### 1. 克隆项目
```bash
git clone https://github.com/aeae-xx7/book-digital-human.git
cd book-digital-human
```

### 2. 安装依赖
你可以使用 `npm`、`yarn` 或 `pnpm` 来安装项目依赖：
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 配置环境变量
在项目根目录下创建一个 `.env.local` 文件，并填入必要的环境变量（如 OpenAI API Key 等）：
```env
# 示例：
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```
打开浏览器并访问 [http://localhost:3000](http://localhost:3000) 即可查看项目。

## 📂 目录结构简述 (Project Structure)

```text
├── src/
│   ├── app/                # Next.js App Router 页面和 API 路由
│   │   ├── api/            # 所有的后端 API 接口 (对话、测试、解析等)
│   │   ├── book/           # 书籍详情页面
│   │   ├── chat/           # 核心对话界面
│   │   └── experience/     # 各种沉浸式互动体验模块 (测试、共事等)
│   ├── components/         # 可复用的 React UI 组件 (导航栏、加载动画等)
│   ├── lib/                # 工具函数与类型定义
│   └── services/           # AI 等核心业务逻辑服务
├── public/                 # 静态资源 (如头像、图片等)
└── next.config.js          # Next.js 配置文件
```

## 🤝 贡献与反馈 (Contributing)

欢迎提交 Issue 或 Pull Request 来帮助完善这个项目！如果你有任何绝妙的创意，也随时欢迎交流。

---
*Created by [aeae-xx7](https://github.com/aeae-xx7)*
