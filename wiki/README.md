# PIck Wiki

Wiki 使用 MkDocs 和 Material for MkDocs，内容以 Markdown 保存在 `docs/` 中，由本地编辑、检查后发布。

## 本地运行

在项目根目录执行：

```powershell
python -m venv .venv-wiki
.\.venv-wiki\Scripts\python.exe -m pip install -r wiki\requirements.txt
.\.venv-wiki\Scripts\python.exe -m mkdocs serve -f wiki\mkdocs.yml
```

打开 <http://127.0.0.1:8000> 预览。

发布前执行严格构建：

```powershell
.\.venv-wiki\Scripts\python.exe -m mkdocs build --strict -f wiki\mkdocs.yml
```

构建产物位于 `wiki/site/`，不提交 Git。正式条目必须区分原书依据、电子版核对、项目负责人的理解与补充、采用状态和产品支持。OCR Markdown 仅用于检索定位，不能替代 PDF 原页和人工确认。

## 云端测试部署

Wiki 使用独立的 Vercel 项目，配置已写入 `vercel.json`。在项目根目录完成本地严格构建后，执行：

```powershell
npx vercel@latest --cwd wiki link
npx vercel@latest --cwd wiki
```

首次关联时创建一个新的项目，例如 `pi-ck-wiki`；不要关联现有 PIck 应用项目。Vercel 会读取 `wiki/vercel.json`，并由 `uv run` 在同一个临时构建环境解析依赖、执行严格构建和发布 `site/` 静态目录。

部署完成后，在 Vercel 项目设置中启用 **Deployment Protection → Vercel Authentication → All Deployments**。不要启用付费的 Password Protection，也暂不连接 GitHub 自动部署。确认未登录的无痕窗口会被拦截后，记下 Vercel 分配的稳定网址。

把稳定网址写入根目录 `.env.local` 的 `NEXT_PUBLIC_WIKI_URL`，然后重新构建并部署 PIck 应用，首页的“科研论 Wiki”入口才会指向云端 Wiki。不要将 Wiki 地址写入 `.env.example` 的默认值。
