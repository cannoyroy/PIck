# PIck

面向保研、留学等场景的找导师项目。当前只搭建工程测试底座：邮箱密码账号、受保护页面、私有测试记录。不包含导师业务模型或产品方法论 Wiki。

## 技术与运行边界

- 单个 Next.js App Router 应用，TypeScript、npm、Tailwind、官方 starter 的 shadcn/ui 组件。
- Supabase 托管 Auth + PostgreSQL；本机网站与 Vercel 测试部署共用一个新加坡测试项目，不依赖本地 Docker。
- 本次已确认个人非商业试验，使用 Supabase Free / Vercel Hobby，不启用付费功能。Supabase Free 闲置一周可能暂停、不含自动备份；Vercel Hobby 不适用于商业用途。
- 仅使用测试账号与虚构数据。测试项目暂时关闭邮箱验证，不代表邮箱归属、验证邮件或密码找回已打通。Supabase Auth API 本身是公网接口；Vercel 网站保护不替代数据库权限。
- 私有页面和写操作验证当前身份，数据库 RLS 再限制记录归属。运行应用只需要 publishable key，不配置 `service_role` 或 secret key。

复用依据及源代码许可见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。原始约定入口是 [AGENTS.md](AGENTS.md)，最新阶段状态见[产品底稿](docs/product-foundation.md)。

## 本地启动

要求 Node.js 22、npm、Git。项目自带锁文件后使用 `npm ci` 复现安装；第一次建立锁文件使用 `npm install`。

```powershell
npm ci
# 仅在尚不存在 .env.local 时执行；不要覆盖已经填写的配置。
Copy-Item .env.example .env.local
npm run dev
```

打开 http://localhost:3000 。未填写 Supabase 配置也可以查看首页与账号页面，但账号按钮禁用，不能据此认定认证成功。

在 `.env.local` 填写 Supabase 控制台提供的项目 URL 和 **publishable key**：

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://你的项目引用.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的publishable_key
```

不要填入 secret key / service_role。`NEXT_PUBLIC_*` 值会发送到浏览器；publishable key 设计上可公开，数据保护依赖权限和 RLS。修改环境变量后重启开发服务器；生产部署需重新构建。

## 准备专用 Supabase 测试项目

1. 创建 Free 项目，区域选择 Singapore；保留数据库密码在自己的密码管理工具中，不提交到仓库或聊天。
2. 在 Authentication → Providers → Email 关闭 **Confirm email**，将密码最短长度设为 8。该设置只适用于本次测试项目，不延伸到正式环境。
3. 在 Authentication → URL Configuration 设置本地 Site URL `http://localhost:3000`；取得云端网址后改为测试网址，并保留本地 redirect URL。当前不包含邮件回调流程。
4. 在 SQL Editor 打开新查询，完整执行一次 [数据库迁移](supabase/migrations/202609200001_foundation_checks.sql)。它在事务内创建表、授权及 RLS。不要反复运行，也不要为了重跑而删除已有表；已存在同名表时先检查来源。
5. 填写本地配置并重启，通过网页注册两个不同的测试账号，再把账号信息填入 `.env.local` 的 `TEST_USER_A_*` / `TEST_USER_B_*`，供验证脚本使用。

迁移文件就是本次数据库结构的版本记录；未来变更新增迁移，不修改已经应用的文件。此次仅有一张 `foundation_checks` 表：账号可增、查、删自己的记录，禁止所有 UPDATE，匿名没有任何表权限。查询失败会显示错误，不伪装成空列表。

## 检查与验证命令

```powershell
npm run lint
npm run typecheck
npm run build
npm test
# 以下两项需要已配置的真实 Supabase 测试项目及两个测试账号。
npm run test:e2e
npm run test:isolation
```

- `npm run check` 顺序执行 lint、typecheck、build。
- 浏览器测试默认复用本机 Chrome，并使用独立临时配置，不读取个人浏览器资料。本机 Chrome 已验证可由 Playwright 启动，无需下载 Chromium。其他机器可设置 `PLAYWRIGHT_CHANNEL=msedge` 复用 Edge；只有没有可用浏览器或需要固定 Playwright 浏览器版本时，才执行 `npx playwright install chromium` 并设置 `PLAYWRIGHT_CHANNEL=chromium`。
- `npm test` 验证首页、账号入口和未登录访问保护；不证明真实账号与数据库可用。
- `npm run test:e2e` 验证新账号注册、错误密码、伪造会话、保存、刷新、双账号隔离、删除和退出。每次运行会保留一个 `pick-e2e-* @example.com` 的一次性 Auth 用户，后续可在测试项目控制台人工清理；不发送邮件，不使用管理员密钥自动删账号。
- `npm run test:isolation` 直接调用数据 API，检查匿名拒绝、双账号独立数据、伪造归属拒绝、跨用户删除无效、禁止更新、本人可删除。只清理本次生成 ID 的记录，不清空任何用户数据。
- 缺少凭据会报告 `BLOCKED` 并以非零状态退出，不用 mock 或跳过冒充通过。
- 浏览器测试默认独立启动 3100 端口；占用该端口时先停止占用进程。截图、视频和 trace 默认关闭，避免记录密码或会话。

生产启动另行检查：`npm run build` 后执行 `npm start`，打开 http://localhost:3000 。不要与占用同一端口的开发服务器同时运行。若 3000 已被占用，PowerShell 中使用 `npm.cmd start -- --port 3101`，打开 http://localhost:3101 ；使用 `npm.cmd` 可避免 PowerShell 的 npm 脚本入口吞掉附加参数。

## 云端测试部署

以下步骤需要 Vercel 账号与 CLI 授权；项目状态中会区分是否实际执行。不要把说明当作已部署证明。

1. 在项目目录运行 `npx vercel login`，由账号持有人完成登录，再运行 `npx vercel link`，创建名为 `pick-test` 的个人 Hobby 项目，项目根目录选当前目录，框架选 Next.js。不选择升级或付费资源。
2. 在 Vercel 项目配置中设置 Node.js 22，并给 Preview 环境添加上面两个 `NEXT_PUBLIC_SUPABASE_*` 变量。不上传测试账号密码、数据库密码或 Supabase 管理密钥。`vercel.json` 已指定 Functions 使用 Singapore（`sin1`），部署时检查平台实际应用了该设置。
3. 在 Deployment Protection 启用 **Vercel Authentication → All Deployments**，不启用付费的 Password Protection。不把 `noindex` 或隐藏网址当作访问保护。
4. 运行 `npx vercel` 创建测试部署，保存真实返回的地址。不运行 `--prod`，不绑定正式域名，不公开推广。
5. 账号持有人登录 Vercel 后打开该地址，人工验证注册、登录、测试记录和退出。
6. 自动化云端验证时，把部署 URL 填入本地 `TEST_BASE_URL`，并把该项目用于自动化的 protection bypass secret 填入本地 `VERCEL_AUTOMATION_BYPASS_SECRET`。该 secret 只用于测试工具，不放到应用环境变量或代码中。

```powershell
npm run test:deployment
npm test
npm run test:e2e
npm run test:isolation
```

`test:deployment` 不带登录或 bypass，检查测试地址拒绝匿名进入；浏览器测试仅向该部署的源站发送一次 bypass 请求以获取测试 Cookie，不向 Supabase 发送 bypass header。控制台中还需确认保护范围确实是 All Deployments。

`TEST_BASE_URL` 设定后浏览器测试使用云端，不启动本地 3100 服务器。数据隔离脚本始终使用 `.env.local` 指定的 Supabase 项目；请核对它与部署使用的是同一个测试项目。

## 凭据与交付

`.env.local`、`.vercel`、构建产物、测试产物和 `.tmp` 不入版本库。日志不打印密码、令牌或完整会话。应用不依赖个人机器路径或外部字体下载。

验收顺序：启动首页 → 账号 A 登录并新增记录 → 刷新仍可见 → 账号 B 看不到该记录 → A 删除自己的记录 → 退出后受保护页面要求登录；随后查看真实 API 隔离测试结果。

若账号、配置、权限或网络阻塞，继续完成不受影响的工作，单独列出未验证项；不扩大为额外基础设施建设。底座验收后进入用户提出的具体业务需求。
