# Vue 3 团队开发模板

> 基于 Vue 3 + TypeScript + Vite 的现代化前端项目模板，集成 FSD 架构、Naive UI、Tailwind CSS v4 和完整的测试框架。

## 🚀 快速开始

```bash
# 1. 使用模板创建项目
# 在 GitHub 上点击 "Use this template" 创建新仓库

# 2. 克隆项目
git clone <your-repo-url>
cd <your-project-name>

# 3. 一键初始化
npm run setup

# 4. 启动开发服务器
npm run dev
```

## 🛠️ 技术栈

| 技术         | 版本 | 说明                       |
| :----------- | :--- | :------------------------- |
| Vue          | 3.x  | 渐进式 JavaScript 框架     |
| TypeScript   | 5.x  | 类型安全的 JavaScript 超集 |
| Vite         | 6.x  | 下一代前端构建工具         |
| Pinia        | 2.x  | Vue 官方状态管理库         |
| Vue Router   | 4.x  | Vue 官方路由管理器         |
| Naive UI     | 2.x  | Vue 3 组件库               |
| Tailwind CSS | 4.x  | 实用优先的 CSS 框架        |
| Vitest       | 4.x  | 极速测试框架               |
| MSW          | 2.x  | API Mock 工具              |

## 📁 项目结构

采用 **Feature-Sliced Design (FSD)** 架构，结合 **Composable + Store 分层**：

```
src/
├── app/              # 应用入口（providers、routing、全局样式）
├── pages/            # 页面层（仅组装 widgets/features）
├── features/         # 功能层（用户交互场景）
│   └── userLogin/
│       ├── components/    # 功能专属组件
│       ├── composables/   # Domain/UI Composable
│       ├── stores/        # Pinia Store
│       └── index.ts
├── entities/         # 实体层（领域模型、API、类型）
├── widgets/          # 复合组件层（Header、Sidebar）
└── shared/           # 共享基础设施
    ├── ui/           # Naive UI 二次封装组件
    ├── lib/          # 工具函数
    ├── api/          # HTTP 客户端
    └── config/       # 全局配置
```

## ✨ 核心特性

- **FSD 架构**：模块化目录结构，依赖规则通过 ESLint 自动校验
- **Composable 分层**：Domain/State/UI/View 清晰分离，Domain 层零框架依赖
- **Naive UI 二次封装**：统一的组件接口，便于未来替换
- **Tailwind CSS v4**：CSS-first 配置，主题变量与 Naive UI 无缝衔接
- **完整测试框架**：Vitest + MSW + Vue Test Utils，覆盖单元测试和 E2E
- **AI 开发集成**：项目级 System Prompt，兼容 Cursor、VS Code Copilot、JetBrains
- **团队标准环境**：VS Code Profile + 一键脚本，新人 30 秒接入

## 📦 脚本命令

| 命令                    | 说明                     |
| :---------------------- | :----------------------- |
| `npm run dev`           | 启动开发服务器           |
| `npm run build`         | 构建生产版本             |
| `npm run lint`          | 运行 ESLint              |
| `npm run type-check`    | 运行 TypeScript 类型检查 |
| `npm run test`          | 启动测试监听模式         |
| `npm run test:run`      | 运行所有测试             |
| `npm run test:coverage` | 运行测试并生成覆盖率报告 |
| `npm run setup`         | 一键初始化项目           |
| `npm run install:ext`   | 安装推荐 VS Code 扩展    |

## 📖 开发规范

详细的开发规范请参考 [DEVELOPMENT.md](DEVELOPMENT.md)，包含：

- 开发环境统一方案
- FSD × Composable 架构规范
- 代码风格与命名约定
- Git 分支与提交规范
- AI 开发集成指南
- 应急响应 SOP

## 📄 许可证

MIT License
