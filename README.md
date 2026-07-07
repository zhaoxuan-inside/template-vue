# Vue 3 团队开发模板 v2.0

> 通过标准化 IDE 环境配置与团队协作规范，消除开发摩擦，提升协作效率。核心策略：环境级治理 + 规范即代码。

---

## 一、开发环境统一

### 1.1 核心策略：VS Code Profile 环境隔离

| 策略     | 说明                                            |
| -------- | ----------------------------------------------- |
| 统一基准 | 封装团队标准 Profile，作为唯一标准开发环境      |
| 一键接入 | 新成员通过导入 Profile 文件即可获得一致开发体验 |
| 互不干扰 | 团队 Profile 与个人 Profile 可无缝切换          |

### 1.2 Profile 导入流程

项目已预置团队标准 Profile 文件 `.vscode/team-vue-dev.code-profile`，新成员直接拉取导入：

```bash
1. 克隆项目后，打开 VS Code
2. Ctrl+Shift+P → "Profiles: Import Profile"
3. 选择项目 .vscode/ 目录下的 team-vue-dev.code-profile
4. 点击"切换到已导入的配置文件"
5. 等待扩展自动安装完成，即可开始开发
```

### 1.3 Profile 版本管理与更新

**版本号约定**：Profile 文件内嵌版本号（见文件头部 `id` 字段）

**手动更新流程**：

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新导入 Profile
Ctrl+Shift+P → "Profiles: Import Profile"
→ 选择 .vscode/team-vue-dev.code-profile
→ 覆盖现有配置

# 3. 重启 VS Code 确保配置生效
Ctrl+Shift+P → "Developer: Reload Window"
```

**更新通知机制**：Leader 更新 Profile 后，通过团队群通知全员执行上述更新流程。

### 1.4 环境一致性保障

| 文件           | 作用                                     |
| -------------- | ---------------------------------------- |
| `.nvmrc`       | 锁定 Node.js 版本（20.19.0）             |
| `.npmrc`       | 统一 npm 配置（registry、engine-strict） |
| `package.json` | 锁定所有依赖版本                         |

### 1.5 一键初始化

```bash
# 克隆项目后，执行一键初始化
npm run setup
```

该命令会自动执行：

- `npm install` - 安装所有依赖
- `husky` - 初始化 Git 钩子
- `git config core.hooksPath .husky` - 配置钩子路径

---

## 二、技术开发准则

### 2.1 架构范式：Composable + Store 分层 × FSD 模块化

项目采用 **"Composable + Store 分层架构"** 作为核心逻辑组织方式，并融合 **Feature-Sliced Design (FSD)** 的模块化目录结构与依赖约束，兼顾开发效率与长期可维护性。

**核心分层原则（逻辑维度）**：

| 层级       | 文件位置                        | 职责                                        | ⚠️ 关键约束                                    |
| ---------- | ------------------------------- | ------------------------------------------- | ---------------------------------------------- |
| Domain     | `composables/domain/useXxx.ts`  | 纯业务规则、数据转换、校验                  | 零 Vue/Naive UI 依赖，可在 Node.js 中独立测试  |
| State      | `stores/xxxStore.ts` (Pinia)    | 响应式状态、异步编排、跨模块协调            | 仅做胶水层，不含复杂业务判断                   |
| UI Adapter | `composables/ui/useNaiveXxx.ts` | Naive UI 交互封装（弹窗、消息、表格分页等） | 隔离 UI 库细节，便于未来替换                   |
| View       | `<script setup>` + Template     | 数据绑定、事件转发、UI 渲染                 | 模板中禁止业务计算，仅消费 Store/UI Composable |

**FSD 模块化目录结构（物理维度）**：

```
src/
├── app/                    # 应用入口（providers、routing、全局样式）
│   ├── providers/          # 全局 providers（NaiveProvider、Pinia 等）
│   ├── routing/            # 路由配置
│   ├── styles/             # 全局样式（Tailwind CSS）
│   └── index.ts
├── pages/                  # 页面层（仅组装 widgets/features）
│   ├── HomePage/
│   └── index.ts
├── features/               # 功能层（用户交互场景，跨实体编排）
│   └── userLogin/
│       ├── components/     # 该功能专属组件
│       ├── composables/    # 包含 domain/ 和 ui/ 子目录
│       │   ├── domain/     # 纯业务逻辑
│       │   └── ui/         # UI 交互封装
│       ├── stores/         # 该功能专属 store
│       └── index.ts        # 公共 API 导出
├── entities/               # 实体层（领域模型、纯 TS Composable）
│   └── user/
│       ├── model/          # User 领域模型、纯 TS Composable
│       ├── api/            # User 相关 API
│       ├── types/          # User 领域类型
│       └── index.ts
├── widgets/                # 复合组件层（header、sidebar）
└── shared/                 # 共享基础设施
    ├── ui/                 # Naive UI 二次封装组件 ⭐
    ├── lib/                # 工具函数
    ├── api/                # Axios 实例、请求拦截器
    └── config/             # 全局配置
```

**层依赖规则（强制执行）**：

| 层级     | 可依赖的层                          |
| -------- | ----------------------------------- |
| app      | shared                              |
| pages    | shared、entities、features、widgets |
| widgets  | shared、entities、features          |
| features | shared、entities                    |
| entities | shared                              |
| shared   | 无                                  |

✅ `shared ← entities ← features ← widgets ← pages ← app`
❌ 下层严禁依赖上层（如 entities 不可引用 features）
❌ 同层 slice 之间严禁直接引用（如 userLogin 不可直接引用 searchProduct，需通过 entities 或 shared 中转）

**验证工具**：已配置 `eslint-plugin-boundaries` 自动校验依赖方向，违规导入将在 IDE 中报错并在 CI 中阻断。

**路径别名配置**：

| 别名          | 指向             | 用途       |
| ------------- | ---------------- | ---------- |
| `@app/*`      | `src/app/*`      | 应用入口层 |
| `@pages/*`    | `src/pages/*`    | 页面层     |
| `@features/*` | `src/features/*` | 功能层     |
| `@entities/*` | `src/entities/*` | 实体层     |
| `@widgets/*`  | `src/widgets/*`  | 组件组合层 |
| `@shared/*`   | `src/shared/*`   | 共享层     |

**验证步骤**：

```bash
# 验证 FSD 配置是否正确
npm run lint       # 检查代码规范（包含 boundaries 依赖检查）
npm run type-check # 检查类型（包含路径别名）
npm run build      # 构建生产版本
npm run dev        # 启动开发服务器
```

**使用示例**：

```typescript
// 从 shared/ui 层导入二次封装组件（禁止直接导入 naive-ui）
import { AppButton } from '@shared/ui/AppButton'

// 从 entities 层导入业务实体类型和纯 TS Composable
import type { User } from '@entities/user/types'
import { useUserModel } from '@entities/user/model'

// 从 features 层导入 domain 和 ui composables
import { useLoginDomain } from '@features/userLogin/composables/domain/useLoginDomain'
import { useLoginUI } from '@features/userLogin/composables/ui/useLoginUI'

// 从 features 层导入 store
import { useLoginStore } from '@features/userLogin/stores/loginStore'

// 从 widgets 层导入复合组件
import { Header } from '@widgets/Header'

// 从 pages 层导入页面组件
import { HomePage } from '@pages/HomePage'
```

### 2.2 工具链对齐

- **Vue 3 + Vue Official v3+**：使用官方插件，无需手动配置 Takeover Mode
- **TypeScript**：严格模式，强制使用项目本地版本
- **Vite 6**：构建工具
- **Tailwind CSS v4**：CSS-first 配置方式
- **Naive UI**：核心 UI 库，通过 `@shared/ui/` 二次封装后使用
- **Pinia**：状态管理，仅做响应式胶水层
- **unplugin-vue-components + unplugin-auto-import**：自动导入组件和 API

### 2.3 Naive UI 使用规范

**规则 1：禁止直接使用原生组件**

业务代码中不直接 `import { NButton } from 'naive-ui'`，统一使用 `@shared/ui/` 下的二次封装组件。

**规则 2：交互逻辑下沉**

`useDialog`、`useMessage`、`useNotification` 等必须在 `composables/ui/` 中封装后使用，禁止在 `<script setup>` 中直接调用。

**规则 3：主题变量走 Tailwind**

Naive UI 的 `themeOverrides` 仅用于无法用 CSS 变量覆盖的场景，颜色/间距优先使用 Tailwind `@theme` 定义的变量。

**规则 4：全局配置集中管理**

`NConfigProvider` 的 `locale`、`dateLocale`、`theme` 等统一在 `app/providers/NaiveProvider.vue` 中配置。

**规则 5：按需导入**

已通过 `unplugin-vue-components + unplugin-auto-import` 配置自动导入，无需手动 `import` 组件。

**主题对齐实践**：

在 `src/app/styles/index.css` 的 `@theme` 块中，将 Naive UI 的 CSS 变量映射为 Tailwind 变量：

```css
@import 'tailwindcss';

@theme {
  --color-primary: var(--n-color-primary);
  --color-primary-hover: var(--n-color-primary-hover);
  --color-success: var(--n-color-success);
  --color-warning: var(--n-color-warning);
  --color-danger: var(--n-color-error);
  --color-bg-primary: var(--n-color-background);
  --color-bg-secondary: var(--n-color-card);
  --color-text-primary: var(--n-color-text);
  --color-text-secondary: var(--n-color-text-2);
}
```

### 2.4 智能感知保障

**路径别名配置**（`tsconfig.json`）：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@app/*": ["src/app/*"],
      "@pages/*": ["src/pages/*"],
      "@features/*": ["src/features/*"],
      "@entities/*": ["src/entities/*"],
      "@widgets/*": ["src/widgets/*"],
      "@shared/*": ["src/shared/*"]
    }
  }
}
```

**Vite 配置**（`vite.config.ts`）：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      imports: ['vue', 'pinia'],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [NaiveUiResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@app': resolve(__dirname, 'src/app'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@features': resolve(__dirname, 'src/features'),
      '@entities': resolve(__dirname, 'src/entities'),
      '@widgets': resolve(__dirname, 'src/widgets'),
      '@shared': resolve(__dirname, 'src/shared'),
    },
  },
})
```

### 2.5 Tailwind CSS v4 配置

**全局样式文件**（`src/app/styles/index.css`）：

```css
@import 'tailwindcss';

@theme {
  --color-primary: var(--n-color-primary);
  --color-primary-hover: var(--n-color-primary-hover);
  --color-success: var(--n-color-success);
  --color-warning: var(--n-color-warning);
  --color-danger: var(--n-color-error);
  --color-bg-primary: var(--n-color-background);
  --color-bg-secondary: var(--n-color-card);
  --color-text-primary: var(--n-color-text);
  --color-text-secondary: var(--n-color-text-2);
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}
```

**使用方式**：在 `src/main.ts` 中导入 `@app/styles` 即可，无需额外配置文件。

**主题对齐**：通过 CSS 变量映射实现 Tailwind 与 Naive UI 主题无缝衔接。

### 2.6 性能配置

| 功能         | 配置项                                | 默认值          | 性能影响 | 说明                 |
| ------------ | ------------------------------------- | --------------- | -------- | -------------------- |
| CodeLens     | `editor.codeLens`                     | 开启            | 中       | 显示函数引用数等信息 |
| 内联建议     | `editor.inlineSuggest.enabled`        | 开启            | 高       | AI 辅助代码补全      |
| 语义高亮     | `editor.semanticHighlighting.enabled` | 开启            | 低       | 更丰富的语法着色     |
| 平滑滚动     | `editor.smoothScrolling`              | 开启            | 低       | 流畅的滚动体验       |
| 文件自动保存 | `files.autoSave`                      | `onFocusChange` | 低       | 切换文件时自动保存   |

**低配设备降级方案**：

在 `.vscode/settings.json` 中覆盖以下配置：

```json
{
  "editor.codeLens": false,
  "editor.inlineSuggest.enabled": false,
  "editor.semanticHighlighting.enabled": false
}
```

### 2.7 应急响应 SOP

#### L1 - 快速修复（80% 问题在此解决）

```
1. 重启 Vue 服务：Ctrl+Shift+P → "Volar: Restart Vue Server"
2. 重启 TS 服务：Ctrl+Shift+P → "TypeScript: Restart TS Server"
3. 重新加载窗口：Ctrl+Shift+P → "Developer: Reload Window"
4. 清除 ESLint 缓存：删除 .eslintcache 文件
```

#### L2 - 进阶排查

```
1. 检查 Node.js 版本：node -v（确保与 .nvmrc 一致）
2. 重新安装依赖：rm -rf node_modules package-lock.json && npm install
3. 切换 Profile：Ctrl+Shift+P → "Profiles: Import Profile" → 重新导入
4. 检查扩展状态：确保 Vue.volar 启用、Vetur 禁用
```

#### L3 - 终极方案

```
1. 执行 npm run setup 重新初始化
2. 克隆项目到新目录重新配置
3. 联系 Leader 或团队技术支持
```

---

## 三、团队协作规范

### 3.1 Git 分支策略

```
main          # 主分支，稳定版本
develop       # 开发分支，功能集成
feature/*     # 功能分支，从 develop 创建
hotfix/*      # 紧急修复分支，从 main 创建
release/*     # 发布分支，从 develop 创建
```

### 3.2 Conventional Commits

**提交格式**：

```
<type>(<scope>): <description>

<body>

<footer>
```

**Type 说明**：

| Type     | 说明     | 示例                              |
| -------- | -------- | --------------------------------- |
| feat     | 新功能   | `feat(user): add login feature`   |
| fix      | 修复 bug | `fix(auth): fix token refresh`    |
| docs     | 文档更新 | `docs: update README`             |
| style    | 代码样式 | `style: format code`              |
| refactor | 重构     | `refactor(api): optimize request` |
| perf     | 性能优化 | `perf: reduce bundle size`        |
| test     | 测试     | `test: add unit tests`            |
| build    | 构建配置 | `build: update vite config`       |
| ci       | CI 配置  | `ci: update github actions`       |
| chore    | 日常维护 | `chore: update dependencies`      |
| revert   | 撤销提交 | `revert: revert commit xxx`       |

### 3.3 commitlint 强制校验

已配置 `commitlint` + `husky` 钩子，不符合规范的提交将被自动拒绝。

**配置文件**：`commitlint.config.js`

### 3.4 操作标准化

**统一快捷键清单**：

| 操作         | Windows      | Mac         |
| ------------ | ------------ | ----------- |
| 格式化代码   | Ctrl+Shift+I | Cmd+Shift+I |
| 打开命令面板 | Ctrl+Shift+P | Cmd+Shift+P |
| 全局搜索     | Ctrl+Shift+F | Cmd+Shift+F |
| 符号搜索     | Ctrl+Shift+O | Cmd+Shift+O |
| 快速切换文件 | Ctrl+P       | Cmd+P       |
| 查找引用     | Shift+F12    | Shift+F12   |
| 重命名符号   | F2           | F2          |

### 3.5 扩展白名单

**必装扩展**：

| 扩展 ID                | 名称                  | 用途               |
| ---------------------- | --------------------- | ------------------ |
| Vue.volar              | Vue Language Features | Vue 3 官方语言支持 |
| dbaeumer.vscode-eslint | ESLint                | 代码质量检查       |
| esbenp.prettier-vscode | Prettier              | 代码格式化         |

**推荐扩展**：

| 扩展 ID                   | 名称                      | 用途              |
| ------------------------- | ------------------------- | ----------------- |
| bradlc.vscode-tailwindcss | Tailwind CSS IntelliSense | Tailwind CSS 支持 |
| eamodio.gitlens           | GitLens                   | Git 增强          |
| gruntfuggly.todo-tree     | Todo Tree                 | TODO 管理         |

**禁用扩展**：

| 扩展 ID      | 名称  | 原因                 |
| ------------ | ----- | -------------------- |
| octref.vetur | Vetur | 与 Vue Official 冲突 |

### 3.6 CI 兜底验证

IDE 层面的类型检查仅作为辅助，CI 流水线必须集成独立校验：

```yaml
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

## 四、AI 开发集成

### 4.1 项目级 AI 规则

项目已配置项目级 AI 规则，AI 编辑器会自动加载团队开发规范。不同 IDE 的配置方式如下：

| IDE                      | 配置方式                              | 说明                                  |
| ------------------------ | ------------------------------------- | ------------------------------------- |
| Cursor                   | 自动识别项目根目录规则文件            | System Prompt 自动生效                |
| VS Code + GitHub Copilot | 通过 Settings 配置 Workspace Prompt   | 在 Settings 中粘贴下方规范内容        |
| JetBrains (WebStorm 等)  | 通过 AI Assistant 配置 Project Prompt | 在 AI Assistant 中配置项目级提示词    |
| 其他 IDE                 | 手动配置项目级 System Prompt          | 将下方规范内容添加到 IDE 的 AI 配置中 |

### 4.2 核心 System Prompt

```
你是一名资深 Vue 3 + TypeScript 前端工程师，精通 Vite 6、Tailwind CSS v4、Naive UI 和 Feature-Sliced Design 架构。

## 项目技术栈
- Vue 3 (Composition API + <script setup>)
- TypeScript (严格模式，禁止 any)
- Vite 6 + Tailwind CSS v4 (CSS-first 配置)
- Naive UI (二次封装后使用，禁止直接引用原生组件)
- Pinia (状态管理)
- ESLint Flat Config + Prettier + eslint-plugin-boundaries

## 架构规范（必须严格遵守）

### Composable 分层
- Domain Composable (composables/domain/)：纯 TS 业务逻辑，零 Vue/Naive UI 依赖
- UI Adapter Composable (composables/ui/)：封装 Naive UI 交互（弹窗、消息、表格等）
- Store (stores/)：仅做响应式胶水层，调用 Domain Composable，不含复杂业务判断
- View (<script setup>)：仅消费 Store 和 UI Composable，模板中禁止业务计算

### FSD 依赖规则
- 依赖方向：shared ← entities ← features ← widgets ← pages ← app
- 下层严禁依赖上层
- 同层 slice 之间严禁直接引用，必须通过 entities 或 shared 中转
- Naive UI 原生组件仅在 shared/ui/ 中出现，业务代码使用二次封装组件

## 代码风格
- 单文件组件结构：<script setup lang="ts"> → <template> → <style scoped>
- 路径别名：@shared/ @entities/ @features/ @widgets/ @pages/ @app/
- 命名：函数/变量 camelCase，组件 PascalCase，类型 PascalCase + I/T 前缀可选
- 样式：Tailwind CSS v4 (@import "tailwindcss" + @theme)，<style scoped> 仅用于特殊覆盖
- 格式：单引号、无分号、行宽 100、尾逗号 all

## 目录结构（FSD + Composable 融合架构）
- src/app/ - 应用入口（providers、routing、styles）
- src/pages/ - 页面层（仅组装 widgets/features）
- src/features/ - 功能层（用户交互场景，含 composables/domain/、composables/ui/、stores/）
- src/entities/ - 实体层（领域模型、纯 TS Composable、api、types）
- src/widgets/ - 复合组件层（header、sidebar）
- src/shared/ui/ - Naive UI 二次封装组件
- src/shared/lib/ - 工具函数
- src/shared/api/ - API 客户端
- src/shared/config/ - 配置文件

## Commit 规范
Conventional Commits: feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert(<scope>): <description>

## 输出要求
- 生成的代码必须符合上述所有架构和规范约束
- 提供完整 TypeScript 类型定义，函数必须有返回类型
- Domain 逻辑必须抽离为纯 TS Composable，不得写在组件内
- Naive UI 交互必须封装到 composables/ui/ 中
- 关键业务逻辑添加 JSDoc 注释
- 不生成冗余代码，不使用 any
```

### 4.3 提示词模板

**组件开发**：

```
请帮我开发一个 Vue 3 组件：

【功能描述】
<在此描述>

【Props】
- name: type - 说明

【Emits】
- event: (params) => void - 说明

【技术要求】
- 使用 Composition API + <script setup>
- TypeScript 严格类型
- Tailwind CSS v4 样式
```

**Composable 开发**：

```
请帮我开发一个 Vue 3 Composable：

【功能描述】
<在此描述>

【输入参数】
- param: type - 说明

【返回值】
- state: type - 说明
- method: () => void - 说明
```

---

## 五、运维与维护

### 5.1 配置变更管理流程

```
提出变更 → 团队讨论 → Leader 审批 → 更新配置文件 → 通知全员 → 验证生效
```

### 5.2 季度 Review

每季度结合工具链演进进行配置 Review 与更新：

1. 检查依赖版本是否有重大更新
2. 评估配置是否需要调整
3. 更新 Profile 文件
4. 通知全员执行更新

### 5.3 规模化收益

| 团队规模 | 收益                                   |
| -------- | -------------------------------------- |
| 10 人    | 消除环境配置差异，提升协作效率         |
| 20+ 人   | 边际效益持续放大，新人接入成本趋近于零 |

---

## 六、附录

### 6.1 配置文件清单

| 文件                                | 作用                                                                  |
| ----------------------------------- | --------------------------------------------------------------------- |
| `.vscode/settings.json`             | 团队统一设置                                                          |
| `.vscode/extensions.json`           | 扩展白名单                                                            |
| `.vscode/launch.json`               | 调试配置                                                              |
| `.vscode/tasks.json`                | 任务配置                                                              |
| `.vscode/team-vue-dev.code-profile` | 团队标准 Profile                                                      |
| `tsconfig.json`                     | TypeScript 主配置                                                     |
| `tsconfig.eslint.json`              | ESLint 专用配置                                                       |
| `vite.config.ts`                    | Vite 构建配置                                                         |
| `eslint.config.js`                  | ESLint Flat Config                                                    |
| `.prettierrc.json`                  | Prettier 格式化规则                                                   |
| `.editorconfig`                     | 跨编辑器一致性                                                        |
| `commitlint.config.js`              | Commit 消息校验                                                       |
| `.husky/pre-commit`                 | 提交前钩子                                                            |
| `.husky/commit-msg`                 | 提交消息钩子                                                          |
| `lint-staged.config.js`             | 提交前检查配置                                                        |
| `.nvmrc`                            | Node.js 版本锁定                                                      |
| `.npmrc`                            | npm 统一配置                                                          |
| AI 规则文件                         | 项目级 System Prompt（适配 Cursor、VS Code Copilot、JetBrains AI 等） |
| `src/style/index.css`               | Tailwind CSS v4 配置                                                  |
| `src/app/`                          | FSD 应用入口层                                                        |
| `src/pages/`                        | FSD 页面层                                                            |
| `src/features/`                     | FSD 功能层                                                            |
| `src/entities/`                     | FSD 实体层                                                            |
| `src/widgets/`                      | FSD 组件组合层                                                        |
| `src/shared/`                       | FSD 共享层（ui、lib、api、config）                                    |

### 6.2 快速开始

```bash
# 1. 克隆项目
git clone <repository-url>
cd <project-name>

# 2. 一键初始化
npm run setup

# 3. 启动开发服务器
npm run dev

# 4. 构建生产版本
npm run build

# 5. 运行 lint
npm run lint

# 6. 运行类型检查
npm run type-check
```

### 6.3 使用模板创建新项目

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

# 4. 修改必要信息
# - package.json: name, description, version, repository, author
# - index.html: title, description
# - README.md: 替换为新项目文档
# - LICENSE: 根据项目需求修改
```

### 6.4 配置变更历史

| 版本 | 日期       | 变更内容                                                                                 |
| ---- | ---------- | ---------------------------------------------------------------------------------------- |
| v1.0 | 2026-07-07 | 初始版本，核心配置文件与方案                                                             |
| v1.1 | 2026-07-07 | 添加模板使用指南、可选配置                                                               |
| v1.2 | 2026-07-07 | 生成 Profile 文件、AI 提示词                                                             |
| v1.3 | 2026-07-07 | 修复 ESLint 配置、常见问题解答                                                           |
| v2.0 | 2026-07-07 | 全面升级：Vue Official v3+、Tailwind v4、commitlint、AI 规则文件、一键脚本、L1/L2/L3 SOP |
