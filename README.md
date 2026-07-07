# Vue 3 团队开发模板

> 本方案旨在通过标准化 IDE 环境配置，消除 10 人团队的开发摩擦，确保类型安全与协作效率。核心策略已从"代码级约束"升级为"环境级治理"。

---

## 一、核心治理策略：VS Code Profile 环境隔离

### 1.1 策略概述

放弃修改成员全局设置的传统做法，采用 VS Code Profiles 实现团队规范与个人偏好的物理隔离。

| 策略 | 说明 |
|------|------|
| 统一基准 | 封装包含最小必要扩展集和强制配置的 Team-Vue-Dev Profile，作为团队唯一标准开发环境 |
| 一键接入 | 新成员通过导入 Profile 文件即可在 30 秒内获得与 Leader 完全一致的开发体验 |
| 互不干扰 | 团队成员可在团队 Profile 与个人 Profile 间无缝切换 |

### 1.2 Profile 导入流程

项目已预置团队标准 Profile 文件 [team-vue-dev.code-profile](file:///home/hardstone/CodeSpace/GitHub/template-vue/.vscode/team-vue-dev.code-profile)，新成员直接拉取导入即可：

```bash
1. 克隆项目后，打开 VS Code
2. Ctrl+Shift+P → "Profiles: Import Profile"
3. 选择项目 .vscode/ 目录下的 team-vue-dev.code-profile
4. 点击"切换到已导入的配置文件"
5. 等待扩展自动安装完成，即可开始开发
```

Profile 文件已包含：
- 团队统一的编辑器设置（格式化、ESLint、代码提示）
- 必装扩展列表（Volar、ESLint、Prettier 等）
- 性能优化配置（CodeLens、智能提示等开启）

---

## 二、技术开发准则

### 2.1 工具链对齐

- **Vue 3 + Volar**：强制使用 Vue 3 官方生态
- **Volar Takeover Mode**：启用并强制使用，确保 Vue 组件完整类型支持
- **本地 TypeScript**：强制使用项目本地 TypeScript 版本以确保类型推断一致性

### 2.2 智能感知保障

**路径别名配置**（[tsconfig.json](file:///home/hardstone/CodeSpace/GitHub/template-vue/tsconfig.json)）：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

**Vite 配置**（[vite.config.ts](file:///home/hardstone/CodeSpace/GitHub/template-vue/vite.config.ts)）：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  }
})
```

### 2.3 性能与体验平衡

开发主机性能较强，优先保证开发体验，所有增强功能默认开启：

| 功能 | 配置项 | 默认值 | 说明 |
|------|--------|--------|------|
| CodeLens | `editor.codeLens` | 开启 | 显示函数引用数、实现数等信息 |
| Volar CodeLens | `volar.codeLens.enabled` | 开启 | Vue 组件相关代码信息 |
| 文件自动保存 | `files.autoSave` | `onFocusChange` | 切换文件时自动保存 |
| 自动导入提示 | `javascript.suggest.autoImports` | 开启 | 自动补全导入语句 |
| 类型检查 | `volar.tsPlugin.checkOnSave` | 开启 | 保存时进行类型检查 |
| 内联建议 | `editor.inlineSuggest.enabled` | 开启 | AI 辅助代码补全 |
| 语义高亮 | `editor.semanticHighlighting.enabled` | 开启 | 更丰富的语法着色 |
| 平滑滚动 | `editor.smoothScrolling` | 开启 | 流畅的滚动体验 |

### 2.4 应急响应 SOP

```
1. 重启 Volar 服务：Ctrl+Shift+P → "Volar: Restart Vue Server"
2. 重启 TypeScript 服务：Ctrl+Shift+P → "TypeScript: Restart TS Server"
3. 检查 Node.js 版本：node -v（确保与 .nvmrc 一致）
4. 重新安装依赖：rm -rf node_modules && npm install
5. 清除缓存：Ctrl+Shift+P → "Developer: Reload Window"
6. 切换 Profile：点击左下角管理按钮 → 选择 Team-Vue-Dev
7. 检查扩展状态：确保 Volar 启用、Vetur 禁用
```

---

## 三、团队协作规范

### 3.1 操作标准化

**统一快捷键清单：**

| 操作 | Windows | Mac |
|------|---------|-----|
| 格式化代码 | Ctrl+Shift+I | Cmd+Shift+I |
| 打开命令面板 | Ctrl+Shift+P | Cmd+Shift+P |
| 全局搜索 | Ctrl+Shift+F | Cmd+Shift+F |
| 符号搜索 | Ctrl+Shift+O | Cmd+Shift+O |
| 快速切换文件 | Ctrl+P | Cmd+P |
| 查找引用 | Shift+F12 | Shift+F12 |
| 重命名符号 | F2 | F2 |

### 3.2 扩展白名单制

**必装扩展（强制）：**

| 扩展 ID | 名称 | 用途 |
|---------|------|------|
| Vue.volar | Vue Language Features | Vue 3 官方语言支持 |
| dbaeumer.vscode-eslint | ESLint | 代码质量检查 |
| esbenp.prettier-vscode | Prettier - Code formatter | 代码格式化 |
| gruntfuggly.todo-tree | Todo Tree | TODO 管理 |

**推荐扩展（可选）：**

| 扩展 ID | 名称 | 用途 |
|---------|------|------|
| bradlc.vscode-tailwindcss | Tailwind CSS IntelliSense | Tailwind CSS 支持 |
| eamodio.gitlens | GitLens | Git 增强 |
| formulahendry.auto-rename-tag | Auto Rename Tag | 标签自动重命名 |

**禁用扩展（强制）：**

| 扩展 ID | 名称 | 原因 |
|---------|------|------|
| octref.vetur | Vetur | Vue 2 插件，与 Volar 冲突 |

配置文件：[.vscode/extensions.json](file:///home/hardstone/CodeSpace/GitHub/template-vue/.vscode/extensions.json)

### 3.3 CI 兜底验证

IDE 层面的类型检查仅作为辅助，必须在 CI 流水线中集成独立的类型校验环节：

```yaml
# .github/workflows/ci.yml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: '.nvmrc' }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build
```

---

## 四、本地环境一致性

### 4.1 Node.js 版本锁定

配置文件：[.nvmrc](file:///home/hardstone/CodeSpace/GitHub/template-vue/.nvmrc)

```bash
# 使用 nvm 自动切换版本
nvm use
```

### 4.2 npm 统一配置

配置文件：[.npmrc](file:///home/hardstone/CodeSpace/GitHub/template-vue/.npmrc)

```ini
engine-strict=true
registry=https://registry.npmmirror.com/
```

### 4.3 package.json engines 字段

```json
{
  "engines": {
    "node": ">=20.10.0",
    "npm": ">=10.0.0"
  }
}
```

---

## 五、配置文件清单

| 文件 | 作用 | 是否纳入版本控制 |
|------|------|----------------|
| [.vscode/settings.json](file:///home/hardstone/CodeSpace/GitHub/template-vue/.vscode/settings.json) | 团队统一设置 | ✅ |
| [.vscode/extensions.json](file:///home/hardstone/CodeSpace/GitHub/template-vue/.vscode/extensions.json) | 扩展白名单 | ✅ |
| [.vscode/launch.json](file:///home/hardstone/CodeSpace/GitHub/template-vue/.vscode/launch.json) | 调试配置 | ✅ |
| [.vscode/tasks.json](file:///home/hardstone/CodeSpace/GitHub/template-vue/.vscode/tasks.json) | 任务配置 | ✅ |
| [tsconfig.json](file:///home/hardstone/CodeSpace/GitHub/template-vue/tsconfig.json) | TypeScript 主配置 | ✅ |
| [tsconfig.node.json](file:///home/hardstone/CodeSpace/GitHub/template-vue/tsconfig.node.json) | Vite 配置专用 | ✅ |
| [vite.config.ts](file:///home/hardstone/CodeSpace/GitHub/template-vue/vite.config.ts) | Vite 构建配置 | ✅ |
| [eslint.config.js](file:///home/hardstone/CodeSpace/GitHub/template-vue/eslint.config.js) | ESLint Flat Config | ✅ |
| [.prettierrc.json](file:///home/hardstone/CodeSpace/GitHub/template-vue/.prettierrc.json) | Prettier 格式化规则 | ✅ |
| [.editorconfig](file:///home/hardstone/CodeSpace/GitHub/template-vue/.editorconfig) | 跨编辑器一致性 | ✅ |
| [lint-staged.config.js](file:///home/hardstone/CodeSpace/GitHub/template-vue/lint-staged.config.js) | 提交前检查配置 | ✅ |
| [.nvmrc](file:///home/hardstone/CodeSpace/GitHub/template-vue/.nvmrc) | Node.js 版本锁定 | ✅ |
| [.npmrc](file:///home/hardstone/CodeSpace/GitHub/template-vue/.npmrc) | npm 统一配置 | ✅ |
| [.gitignore](file:///home/hardstone/CodeSpace/GitHub/template-vue/.gitignore) | Git 忽略配置 | ✅ |

---

## 六、落地与演进机制

### 6.1 分阶段执行

| 阶段 | 任务 | 完成标志 |
|------|------|----------|
| 准备 | 确定工具链版本与核心配置 | 配置文件初稿完成 |
| 配置 | 创建所有配置文件并提交 | 代码仓库包含完整配置 |
| 文档 | 编写团队开发文档 | README.md 完善 |
| 宣贯 | 团队培训与答疑 | 全员理解并接受方案 |
| 验证 | 试运行并收集反馈 | 新成员接入时间 < 5 分钟 |
| 兜底 | CI 流水线集成 | 代码提交自动校验 |

### 6.2 动态维护

- **季度 Review**：每季度结合工具链演进进行配置 Review 与更新
- **变更管理流程**：提出变更 → 团队讨论 → Leader 审批 → 更新配置文件 → 通知全员 → 验证生效

### 6.3 规模化收益

该方案具备极强的可复制性：
- **10 人团队**：消除环境配置差异，提升协作效率
- **20+ 人团队**：边际效益持续放大，新人接入成本趋近于零

---

## 七、使用模板创建新项目

### 7.1 使用方式

```bash
# 1. 在 GitHub 上点击 "Use this template" 创建新仓库
# 2. 克隆新仓库
git clone <your-new-repo-url>
cd <your-project-name>

# 3. 删除模板的 git 历史，初始化新的 git
rm -rf .git
git init
git add .
git commit -m "chore: init project from template-vue"
```

### 7.2 创建后必须修改的内容

| 文件 | 修改项 |
|------|--------|
| [package.json](file:///home/hardstone/CodeSpace/GitHub/template-vue/package.json) | `name`、`description`、`version`、`repository`、`author` |
| [index.html](file:///home/hardstone/CodeSpace/GitHub/template-vue/index.html) | `<title>`、`<meta name="description">` |
| [README.md](file:///home/hardstone/CodeSpace/GitHub/template-vue/README.md) | 替换为新项目文档 |
| [LICENSE](file:///home/hardstone/CodeSpace/GitHub/template-vue/LICENSE) | 根据项目需求修改许可证 |

### 7.3 初始化新项目

```bash
# 1. 切换 Node.js 版本
nvm use

# 2. 安装依赖（首次安装会自动初始化 husky）
npm install

# 3. 启动开发服务器验证
npm run dev

# 4. 运行 lint 和类型检查
npm run lint
npm run type-check

# 5. 构建生产版本验证
npm run build
```

### 7.4 可选配置

**添加 Tailwind CSS：**
```bash
npm install tailwindcss @tailwindcss/vite
```

在 `vite.config.ts` 中添加插件：
```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()]
})
```

创建 `src/style.css`：
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**添加 Pinia 状态管理：**
```bash
npm install pinia
```

在 `src/main.ts` 中引入：
```typescript
import { createPinia } from 'pinia'

createApp(App).use(createPinia()).mount('#app')
```

---

## 八、AI 开发提示词（Prompt）指南

### 8.1 系统提示词（System Prompt）

在使用 AI 辅助开发时，将以下内容作为系统提示词，确保 AI 生成符合团队规范的代码：

```
你是一名资深 Vue 3 + TypeScript 前端工程师，熟悉 Vite 构建工具和现代前端开发最佳实践。

## 项目技术栈
- Vue 3 (Composition API + `<script setup>`)
- TypeScript (严格模式)
- Vite 6
- ESLint (Flat Config) + Prettier
- Pinia (可选状态管理)
- Tailwind CSS (可选样式)

## 代码规范
- 使用 `<script setup>` 语法，避免 Options API
- TypeScript 类型严格，避免 `any`
- 单文件组件结构：script → template → style
- 路径别名使用 `@/` 指向 `src/` 目录
- 函数和变量使用 camelCase 命名
- 组件名使用 PascalCase 命名
- 单引号，无分号，行宽 100 字符
- 组件内样式使用 `<style scoped>`

## 目录结构
- src/components/ - 通用组件
- src/views/ - 页面视图
- src/composables/ - 组合式函数
- src/utils/ - 工具函数
- src/types/ - 类型定义
- src/api/ - API 接口

## 输出要求
- 代码必须符合 ESLint + Prettier 规则
- 提供完整的类型定义
- 函数必须有返回类型
- 关键逻辑添加注释
- 避免生成无用代码
```

### 8.2 组件开发提示词

```
请帮我开发一个 Vue 3 组件，需求如下：

【功能描述】
<在此描述组件功能>

【技术要求】
- 使用 Vue 3 Composition API + `<script setup>`
- TypeScript 严格类型
- 使用 `defineProps` 和 `defineEmits` 定义组件接口
- 如果需要状态管理，使用 `ref`/`reactive`
- 样式使用 `<style scoped>`

【输入输出】
Props:
- propName: type - 说明

Emits:
- eventName: (params) => void - 说明

【参考设计】
<提供设计图或详细描述>

请输出完整的组件代码。
```

### 8.3 Composable 开发提示词

```
请帮我开发一个 Vue 3 Composable，需求如下：

【功能描述】
<在此描述 Composable 功能>

【技术要求】
- 使用 Composition API
- 返回响应式状态和方法
- TypeScript 严格类型
- 支持响应式参数

【输入参数】
- paramName: type - 说明

【返回值】
- state: type - 说明
- method: () => void - 说明

请输出完整的 composable 代码。
```

### 8.4 API 接口开发提示词

```
请帮我开发 API 接口，需求如下：

【功能描述】
<在此描述接口功能>

【技术要求】
- 使用 fetch 或 axios
- TypeScript 严格类型
- 统一错误处理
- 返回 Promise

【接口定义】
- 方法: GET/POST/PUT/DELETE
- 路径: /api/xxx
- 请求体: { field: type }
- 响应体: { data: type, code: number, message: string }

请输出完整的 API 代码。
```

### 8.5 类型定义提示词

```
请帮我定义 TypeScript 类型，需求如下：

【业务描述】
<在此描述业务场景>

【类型要求】
- 严格类型，避免 `any`
- 使用 interface 或 type
- 合理使用泛型
- 考虑边界情况

【字段定义】
- fieldName: type - 说明
- fieldName?: type - 可选字段，说明

请输出完整的类型定义代码。
```

### 8.6 调试与问题排查提示词

```
我遇到了一个问题，需要你的帮助：

【问题描述】
<详细描述问题现象>

【错误信息】
<粘贴错误日志或截图描述>

【相关代码】
<粘贴相关代码片段，包括文件路径>

【已尝试的解决方案】
- 方案1: 结果
- 方案2: 结果

请分析问题原因并提供解决方案。
```

### 8.7 代码重构提示词

```
请帮我重构以下代码，使其更符合 Vue 3 最佳实践：

【原始代码】
<粘贴需要重构的代码>

【重构目标】
- 提高代码可读性
- 优化性能
- 符合团队编码规范
- 减少重复代码

请输出重构后的代码，并说明重构要点。
```

### 8.8 使用技巧

**提升 AI 输出质量的关键：**
1. **提供上下文**：粘贴相关文件内容，让 AI 了解项目结构
2. **明确需求**：详细描述功能、输入输出、边界条件
3. **指定格式**：要求输出代码块，并指定语言
4. **迭代优化**：先获取初稿，再逐步提出改进要求
5. **验证结果**：生成代码后运行 lint 和类型检查

---

## 九、配置变更历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2026-07-07 | 初始版本，包含核心配置文件与完整方案 |
| v1.1 | 2026-07-07 | 添加模板使用指南、可选配置（Tailwind CSS、Pinia） |
| v1.2 | 2026-07-07 | 生成 Profile 文件、优化体验配置、添加 AI 开发提示词 |

---

## 十、快速开始（模板项目本身）

```bash
# 1. 克隆项目
git clone <repository-url>
cd template-vue

# 2. 切换 Node.js 版本
nvm use

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev

# 5. 构建生产版本
npm run build

# 6. 运行 lint
npm run lint

# 7. 运行类型检查
npm run type-check
```

---

## 八、配置变更历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2026-07-07 | 初始版本，包含核心配置文件与完整方案 |
