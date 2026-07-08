# 📘 团队前端开发规范手册 (v2.0)

> **致新成员**：欢迎加入！本规范旨在降低你的认知负荷，让你专注于业务逻辑而非环境配置或架构决策。
>
> - **新手友好**：所有架构约束均已内置到工具链中，IDE 和 AI 会自动引导你写出符合规范的代码。
> - **跨平台兼容**：完美支持 Windows 11 / macOS / Linux。
> - **IDE 无关**：无论你使用 VS Code、Cursor、Windsurf 还是 JetBrains，均遵循同一套规则。

---

## 一、开发环境规范

### 1.1 核心策略：Profile + 脚本双保险

我们采用 **VS Code Profile** 作为环境基准，辅以 **Node.js 脚本** 确保跨平台一致性。禁止手动拼接命令行参数，所有操作均通过 npm scripts 完成。

### 1.2 快速开始

```bash
# 1. 克隆项目
git clone <repo-url>
cd <project-name>

# 2. 安装 Node.js 版本（自动读取 .nvmrc）
# Windows 用户推荐 fnm，Mac/Linux 用户推荐 nvm
fnm use --install-if-missing # 或 nvm use

# 3. 使用团队 Profile 打开项目（首次必须执行）
code --profile "Team Vue Dev" .

# 4. 安装推荐扩展
npm run install:ext

# 5. 一键初始化依赖与钩子
npm run setup

# 6. 启动开发服务器
npm run dev
```

### 1.3 环境一致性保障

| 文件                      | 作用                          | 跨平台注意事项                                |
| :------------------------ | :---------------------------- | :-------------------------------------------- |
| `.nvmrc`                  | 锁定 Node.js 20.19.0          | Windows 推荐用 `fnm` 替代 `nvm-windows`       |
| `.npmrc`                  | 统一 registry + engine-strict | 自动生效，无需手动配置                        |
| `.editorconfig`           | 换行符(LF)、缩进、charset     | **强制 LF**，Git 需配置 `core.autocrlf=input` |
| `.vscode/settings.json`   | 格式化、保存行为、扩展推荐    | Profile 导入后自动生效                        |
| `.vscode/extensions.json` | 必装/禁用扩展白名单           | 打开项目时右下角弹窗提示安装                  |

### 1.4 Profile 管理

**导入方式**：

```bash
# 命令行导入（推荐）
code --profile "Team Vue Dev" .

# UI 界面导入
Ctrl+Shift+P → "Profiles: Import Profile" → 选择 .vscode/team-vue-dev.code-profile
```

**更新流程**：

```bash
git pull origin main
code --profile "Team Vue Dev" .
Ctrl+Shift+P → "Developer: Reload Window"
```

### 1.5 扩展白名单

**必装扩展**：

| 扩展 ID                | 名称                  | 用途               |
| :--------------------- | :-------------------- | :----------------- |
| Vue.volar              | Vue Language Features | Vue 3 官方语言支持 |
| dbaeumer.vscode-eslint | ESLint                | 代码质量检查       |
| esbenp.prettier-vscode | Prettier              | 代码格式化         |

**推荐扩展**：

| 扩展 ID                         | 名称                      | 用途              |
| :------------------------------ | :------------------------ | :---------------- |
| bradlc.vscode-tailwindcss       | Tailwind CSS IntelliSense | Tailwind CSS 支持 |
| eamodio.gitlens                 | GitLens                   | Git 增强          |
| gruntfuggly.todo-tree           | Todo Tree                 | TODO 管理         |
| atommaterial.a-file-icon-vscode | Atom Material Icons       | 文件图标主题      |

**禁用扩展**：

| 扩展 ID      | 名称  | 原因                 |
| :----------- | :---- | :------------------- |
| octref.vetur | Vetur | 与 Vue Official 冲突 |

### 1.6 环境变量规范

| 文件               | 用途                | Git 追踪 |
| :----------------- | :------------------ | :------- |
| `.env.example`     | 变量模板 + 注释说明 | ✅       |
| `.env.development` | 本地开发            | ❌       |
| `.env.production`  | 生产构建            | ❌       |
| `.env.test`        | 测试环境            | ❌       |

**类型安全校验**（`src/shared/config/env.ts`）：

```typescript
import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_TITLE: z.string().min(1),
  VITE_ENABLE_MOCK: z.enum(['true', 'false']).optional(),
})

export const env = envSchema.parse(import.meta.env)
```

### 1.7 操作标准化

**统一快捷键清单**：

| 操作         | Windows      | Mac         |
| :----------- | :----------- | :---------- |
| 格式化代码   | Ctrl+Shift+I | Cmd+Shift+I |
| 打开命令面板 | Ctrl+Shift+P | Cmd+Shift+P |
| 全局搜索     | Ctrl+Shift+F | Cmd+Shift+F |
| 符号搜索     | Ctrl+Shift+O | Cmd+Shift+O |
| 快速切换文件 | Ctrl+P       | Cmd+P       |
| 查找引用     | Shift+F12    | Shift+F12   |
| 重命名符号   | F2           | F2          |

---

## 二、项目架构规范

### 2.1 架构范式：FSD × Composable 分层

项目采用 **Feature-Sliced Design (FSD)** 架构作为目录组织方式，结合 **Composable + Store 分层** 作为逻辑组织方式。

#### 🗺️ 代码存放决策树

当你不确定代码放哪里时，请按以下流程判断：

```text
你要写的代码是什么？
│
├─ 纯业务规则/数据转换/校验（无 Vue/UI 依赖）
│  └─ ✅ entities/<entity>/model/useXxx.ts (Domain Composable)
│
├─ Naive UI 交互封装（弹窗/消息/表格分页）
│  └─ ✅ features/<feature>/composables/ui/useNaiveXxx.ts
│
├─ 响应式状态 + 异步编排（调用 Domain Composable）
│  └─ ✅ features/<feature>/stores/xxxStore.ts
│
├─ 页面级组装（仅组合 widgets/features）
│  └─ ✅ pages/<PageName>/index.vue
│
├─ 可复用的复合 UI 组件（Header/Sidebar）
│  └─ ✅ widgets/<WidgetName>/index.vue
│
├─ Naive UI 二次封装基础组件
│  └─ ✅ shared/ui/<ComponentName>.vue
│
└─ 通用工具函数/API 客户端/配置
   └─ ✅ shared/lib/ | shared/api/ | shared/config/
```

#### 🔒 依赖规则（ESLint 强制执行）

```text
shared ← entities ← features ← widgets ← pages ← app
```

- ❌ 下层严禁依赖上层
- ❌ 同层 slice 之间严禁直接引用（通过 entities/shared 中转）
- ❌ widgets 禁止直接 import features（仅通过 props/slots 注入）
- ⚠️ **执行策略**：`eslint-plugin-boundaries` 设为 `error` 级别，**不设 warn 过渡期**

#### 📋 核心分层原则

| 层级       | 文件位置                        | 职责                                        | ⚠️ 关键约束                                    |
| :--------- | :------------------------------ | :------------------------------------------ | :--------------------------------------------- |
| Domain     | `entities/*/model/useXxx.ts`    | 纯业务规则、数据转换、校验                  | 零 Vue/Naive UI 依赖，可在 Node.js 中独立测试  |
| State      | `features/*/stores/xxxStore.ts` | 响应式状态、异步编排、跨模块协调            | 仅做胶水层，不含复杂业务判断                   |
| UI Adapter | `features/*/composables/ui/`    | Naive UI 交互封装（弹窗、消息、表格分页等） | 隔离 UI 库细节，便于未来替换                   |
| View       | `<script setup>` + Template     | 数据绑定、事件转发、UI 渲染                 | 模板中禁止业务计算，仅消费 Store/UI Composable |

#### 🚀 路径别名配置

| 别名          | 指向             | 用途       |
| :------------ | :--------------- | :--------- |
| `@app/*`      | `src/app/*`      | 应用入口层 |
| `@pages/*`    | `src/pages/*`    | 页面层     |
| `@features/*` | `src/features/*` | 功能层     |
| `@entities/*` | `src/entities/*` | 实体层     |
| `@widgets/*`  | `src/widgets/*`  | 组件组合层 |
| `@shared/*`   | `src/shared/*`   | 共享层     |

#### ✅ 验证步骤

```bash
npm run lint       # 检查代码规范（包含 boundaries 依赖检查）
npm run type-check # 检查类型（包含路径别名）
npm run test:run   # 运行单元测试
npm run build      # 构建生产版本
```

### 2.2 命名规范

| 类型            | 规则                          | 示例                                 |
| :-------------- | :---------------------------- | :----------------------------------- |
| 组件文件        | PascalCase                    | `AppButton.vue`, `UserLoginForm.vue` |
| Composable 文件 | camelCase + use 前缀          | `useUserModel.ts`, `useLoginUI.ts`   |
| Store 文件      | camelCase + Store 后缀        | `loginStore.ts`                      |
| 类型文件        | camelCase                     | `user.ts`, `auth.ts`                 |
| CSS 类名        | Tailwind 优先，scoped 兜底    | `class="text-primary mt-2"`          |
| 常量            | UPPER_SNAKE_CASE              | `MAX_RETRY_COUNT`                    |
| 事件            | on 前缀（Props）/ emit 无前缀 | `onSubmit` / `emit('submit')`        |

### 2.3 测试策略

| 层级              | 工具                    | 覆盖率要求 | 文件命名               | 说明                     |
| :---------------- | :---------------------- | :--------- | :--------------------- | :----------------------- |
| Domain Composable | Vitest                  | ≥ 80%      | `useXxx.spec.ts`       | 纯 TS，无需 Vue 环境     |
| UI Composable     | Vitest + Vue Test Utils | ≥ 60%      | `useNaiveXxx.spec.ts`  | Mock Naive UI 交互       |
| Store             | Vitest + Pinia Testing  | ≥ 70%      | `xxxStore.spec.ts`     | 验证状态流转             |
| 组件              | Vue Test Utils          | 关键交互   | `XxxComponent.spec.ts` | 不追求覆盖率，重行为验证 |
| E2E               | Playwright              | 核心流程   | `e2e/*.spec.ts`        | 登录、下单等关键路径     |

**Mock 规范**：

- API Mock 统一放 `shared/mocks/`
- 使用 MSW (Mock Service Worker) 拦截请求
- 测试中禁止直接 mock 整个模块，优先 mock 边界接口

---

## 三、代码规范

### 3.1 代码风格

| 维度           | 规则                                                                     |
| :------------- | :----------------------------------------------------------------------- |
| 单文件组件结构 | `<script setup lang="ts">` → `<template>` → `<style scoped>`             |
| 引号           | 单引号                                                                   |
| 分号           | 不使用                                                                   |
| 行宽           | 100 字符                                                                 |
| 尾逗号         | all                                                                      |
| 路径别名       | `@shared/*` `@entities/*` `@features/*` `@widgets/*` `@pages/*` `@app/*` |

### 3.2 Naive UI 使用铁律

1. **禁止直接导入原生组件**：业务代码中不得出现 `import { NButton } from 'naive-ui'`
2. **交互逻辑下沉**：`useDialog/useMessage/useNotification` 必须在 `composables/ui/` 中封装
3. **主题变量走 Tailwind**：颜色/间距优先使用 `@theme` 定义的变量
4. **全局配置集中管理**：`NConfigProvider` 仅在 `app/providers/NaiveProvider.vue` 中配置

### 3.3 Tailwind CSS v4 + Naive UI 主题同步

> ✅ **自动化**：主题变量由构建脚本自动生成并纳入 CI 检查。

```bash
npm run sync:theme
```

### 3.4 性能增强

| 维度         | 措施                                            | 集成方式                                 |
| :----------- | :---------------------------------------------- | :--------------------------------------- |
| Bundle Size  | 首屏 JS < 200KB，超限告警                       | `rollup-plugin-visualizer` + CI 阈值检查 |
| Lighthouse   | Performance ≥ 90, Accessibility ≥ 90            | `lighthouse-ci` 集成到 PR 检查           |
| IDE 低配降级 | `.vscode/settings.json` 提供 `low-perf` Profile | 关闭 CodeLens/语义高亮/内联建议          |
| 废弃提示     | `@deprecated` + `eslint-plugin-deprecation`     | IDE 划线 + 构建警告                      |
| 安全扫描     | `npm audit` + CSP Header + `v-html` 审批        | CI 阻断高危漏洞                          |

### 3.5 Code Review 检查清单

> CR 不是可选建议，是合并前的**强制门禁**。Reviewer 必须逐项确认：

- [ ] **FSD 依赖方向**：是否违反 `shared ← entities ← features ← widgets ← pages`？
- [ ] **Domain 纯净性**：Domain Composable 是否包含 Vue/Naive UI 引用？
- [ ] **Naive UI 封装**：是否直接从 `naive-ui` 导入原生组件？
- [ ] **Store 职责**：Store 是否包含复杂业务判断（应下沉到 Domain）？
- [ ] **Widgets 隔离**：Widget 是否直接 import 了 features 模块？
- [ ] **测试覆盖**：新增 Domain Composable 是否有对应单元测试？
- [ ] **类型安全**：是否存在 `any`？函数是否有返回类型？
- [ ] **环境变量**：新增变量是否同步更新 `.env.example` 和 zod schema？
- [ ] **i18n 预留**：硬编码文案是否已提取到 i18n key（即使当前未启用）？

---

## 四、代码提交规范

### 4.1 Git 分支策略

```text
main ← develop ← feature/* | hotfix/* | release/*
```

### 4.2 Conventional Commits（commitlint 强制）

**提交格式**：

```
<type>(<scope>): <description>

<body>

<footer>
```

**Type 说明**：

| Type     | 说明     | 示例                               |
| :------- | :------- | :--------------------------------- |
| feat     | 新功能   | `feat(user): add login domain`     |
| fix      | 修复 bug | `fix(auth): correct token refresh` |
| docs     | 文档更新 | `docs: update README`              |
| style    | 代码样式 | `style: format code`               |
| refactor | 重构     | `refactor(api): optimize request`  |
| perf     | 性能优化 | `perf: reduce bundle size`         |
| test     | 测试     | `test: add unit tests`             |
| build    | 构建配置 | `build: update vite config`        |
| ci       | CI 配置  | `ci: update github actions`        |
| chore    | 日常维护 | `chore: update dependencies`       |
| revert   | 撤销提交 | `revert: revert commit xxx`        |

### 4.3 提交前检查

```bash
# 提交前自动执行（已配置 lint-staged）
npm run lint       # ESLint + Boundaries 检查
npm run type-check # TypeScript 类型检查
npm run test:run   # 单元测试
```

### 4.4 CI 流水线

**配置位置**：`.github/workflows/ci.yml`

**检查项**：

1. ESLint + Boundaries 检查
2. TypeScript 类型检查
3. 单元测试（含覆盖率）
4. 主题同步验证
5. 生产构建
6. 安全审计

---

## 五、AI 提示词规范

### 5.1 项目级 AI 规则文件

> **设计原则**：所有提示词和 Skill 均存储在项目仓库中，与具体 IDE 解耦。

| 文件                     | 用途                         | 兼容 IDE                                |
| :----------------------- | :--------------------------- | :-------------------------------------- |
| `.ai/rules/project.md`   | 核心架构规范 + 代码风格      | Cursor / Copilot / Windsurf / JetBrains |
| `.ai/rules/fsd-guide.md` | FSD 分层决策树 + 示例        | 同上                                    |
| `.ai/rules/naive-ui.md`  | Naive UI 封装规范 + 禁用清单 | 同上                                    |
| `.ai/rules/testing.md`   | 测试策略 + Mock 规范         | 同上                                    |
| `.ai/changelog.md`       | AI 规则变更记录              | 人工维护                                |

> ✅ **版本化管理**：每次架构调整后，必须同步更新 `.ai/rules/` 下的文件，并在 `.ai/changelog.md` 中记录变更内容。

### 5.2 核心 System Prompt

```markdown
你是一名资深 Vue 3 + TypeScript 前端工程师，严格遵守本项目 FSD × Composable 分层架构。

## 技术栈

Vue 3 (Composition API + <script setup>) | TypeScript (严格模式，禁止 any)
Vite 6 | Tailwind CSS v4 (CSS-first) | Naive UI (仅通过 @shared/ui/ 使用)
Pinia (胶水层) | Vitest | ESLint Flat Config + eslint-plugin-boundaries

## 架构铁律

1. Domain Composable (entities/*/model/)：纯 TS，零 Vue/UI 依赖，可在 Node.js 独立测试
2. UI Adapter Composable (features/*/composables/ui/)：封装 Naive UI 交互
3. Store (features/*/stores/)：仅做响应式胶水层，调用 Domain Composable
4. View (<script setup>)：仅消费 Store 和 UI Composable，模板禁止业务计算
5. FSD 依赖方向：shared ← entities ← features ← widgets ← pages ← app
6. widgets 禁止直接 import features，仅通过 props/slots 注入
7. Naive UI 原生组件仅在 shared/ui/ 中出现

## 代码风格

- 单文件组件：<script setup lang="ts"> → <template> → <style scoped>
- 路径别名：@shared/* @entities/* @features/* @widgets/* @pages/* @app/*
- 命名：函数/变量 camelCase，组件 PascalCase，类型 PascalCase
- 样式：Tailwind CSS v4 @theme 变量优先，<style scoped> 仅用于特殊覆盖
- 格式：单引号、无分号、行宽 100、尾逗号 all

## 输出要求

- 生成的代码必须符合上述所有约束
- 提供完整 TypeScript 类型定义，函数必须有返回类型
- Domain 逻辑必须抽离为纯 TS Composable
- Naive UI 交互必须封装到 composables/ui/
- 关键业务逻辑添加 JSDoc 注释
- 不生成冗余代码，不使用 any
- 新增 Domain Composable 必须附带 Vitest 测试用例
```

### 5.3 Skill 推荐

| Skill 名称    | 触发指令                       | 输入                  | 输出                                                        |
| :------------ | :----------------------------- | :-------------------- | :---------------------------------------------------------- |
| 创建 Feature  | `/create-feature <name>`       | 功能描述              | 完整 FSD 目录结构 + Domain/UI Composable + Store + 测试骨架 |
| 创建 Entity   | `/create-entity <name>`        | 实体字段定义          | Model + API + Types + Domain Composable + 测试              |
| 封装 Naive UI | `/wrap-naive <component>`      | 原生组件名 + 定制需求 | `@shared/ui/` 封装组件 + Props 类型 + 使用示例              |
| 编写测试      | `/write-test <file-path>`      | 目标文件路径          | Vitest 测试用例（Domain 纯 TS / UI Mock 交互）              |
| 重构检查      | `/refactor-check <file-path>`  | 目标文件路径          | FSD 违规分析 + Domain 纯净度报告 + 重构建议                 |
| 环境变量      | `/add-env <key> <description>` | 变量名 + 说明         | `.env.example` 条目 + zod schema 更新 + 类型声明            |
| i18n 提取     | `/extract-i18n <file-path>`    | 目标文件路径          | 硬编码文案 → i18n key + locale 文件更新                     |

### 5.4 提示词模板

**组件开发**：

```text
请帮我开发一个 Vue 3 组件，严格遵守项目 FSD 架构：

【功能描述】<在此描述>
【所属层级】feature: <feature-name> | widget: <widget-name> | shared
【Props】
- name: type - 说明
【Emits】
- event: (params) => void - 说明
【技术要求】
- 使用 Composition API + <script setup lang="ts">
- TypeScript 严格类型，禁止 any
- Tailwind CSS v4 样式，使用 @theme 变量
- Naive UI 组件从 @shared/ui/ 导入
- 交互逻辑封装到 composables/ui/
- 附带 Vitest 测试用例
```

**Domain Composable 开发**：

```text
请帮我开发一个 Domain Composable，严格遵守纯 TS 约束：

【功能描述】<在此描述>
【所属实体】entities/<entity-name>
【输入参数】
- param: type - 说明
【返回值】
- state: type - 说明
- method: () => void - 说明
【约束】
- 零 Vue/Naive UI 依赖
- 可在 Node.js 中独立运行
- 附带 Vitest 测试用例，覆盖率 ≥ 80%
- 关键逻辑添加 JSDoc 注释
```

---

## 六、附录

### A. 应急响应 SOP

| 级别 | 操作                                                      | 适用场景             |
| :--- | :-------------------------------------------------------- | :------------------- |
| L1   | `Ctrl+Shift+P` → `Volar: Restart Vue Server`              | 类型报错、组件不识别 |
| L1   | `Ctrl+Shift+P` → `TypeScript: Restart TS Server`          | TS 类型不更新        |
| L2   | 删除 `node_modules` + `package-lock.json` → `npm install` | 依赖幽灵问题         |
| L2   | `code --profile "Team Vue Dev" .` → 重新导入 Profile      | 设置/扩展异常        |
| L3   | `npm run setup` → 完整重置                                | 钩子/环境变量丢失    |
| L3   | 联系 Leader 并在 Issue 中记录                             | 规范本身存在缺陷     |

### B. 配置文件清单

| 文件                                  | 作用                            |
| :------------------------------------ | :------------------------------ |
| `.vscode/team-vue-dev.code-profile`   | 团队标准 Profile                |
| `.vscode/settings.json`               | 统一编辑器设置                  |
| `.vscode/extensions.json`             | 扩展白名单                      |
| `tsconfig.json`                       | TypeScript 主配置               |
| `vite.config.ts`                      | Vite 构建配置                   |
| `eslint.config.js`                    | ESLint Flat Config + boundaries |
| `.prettierrc.json`                    | 格式化规则                      |
| `commitlint.config.js`                | Commit 消息校验                 |
| `.husky/pre-commit`                   | 提交前钩子                      |
| `lint-staged.config.js`               | 暂存区检查                      |
| `.nvmrc` / `.npmrc` / `.editorconfig` | 环境一致性                      |
| `.ai/rules/*.md`                      | AI 规则文件（版本化）           |
| `.ai/changelog.md`                    | AI 规则变更记录                 |
| `scripts/sync-theme.ts`               | Naive UI → Tailwind 主题同步    |
| `src/shared/config/env.ts`            | 环境变量 zod 校验               |

### C. 配置变更历史

| 版本 | 日期       | 变更内容                                                                                               |
| :--- | :--------- | :----------------------------------------------------------------------------------------------------- |
| v1.0 | 2026-07-07 | 初始版本，核心配置文件与方案                                                                           |
| v1.1 | 2026-07-07 | 添加模板使用指南、可选配置                                                                             |
| v1.2 | 2026-07-07 | 生成 Profile 文件、AI 提示词                                                                           |
| v1.3 | 2026-07-07 | 修复 ESLint 配置、常见问题解答                                                                         |
| v2.0 | 2026-07-08 | 全面升级：Vue Official v3+、Tailwind v4、commitlint、AI 规则文件、一键脚本、L1/L2/L3 SOP、文档结构重构 |
