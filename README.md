# 德华故事集 · Stories About Chinese in Germany

一本关于在德国生活的华人的故事合集——记录创业、职场、生活里那些不太想被忘掉的片刻。

**🌐 线上版：[stories.novawerk.io](https://stories.novawerk.io)**

## 栏目

- [🇩🇪 创业往事 · 我开软件公司的七年](./articles/🇩🇪创业往事-我开软件公司的七年) — 在德国创业七年的心路历程。
- [🇩🇪 小厂打工人 · 不定期汇报](./articles/🇩🇪小厂打工人不定期汇报) — 在德国中小型企业工作的日常与观察。
- [🇩🇪 再启程前的故事 · 在德国公司做管理](./articles/🇩🇪再启程前的故事%20-%20在德国公司做管理) — 一段在德国公司做管理的经历。

## 怎么投稿

两种方式，都是 PR 工作流：

1. **不熟 Git**：[打开一个投稿 Issue](https://github.com/Novawerk/stories-about-chinese-in-germany/issues/new?template=new-story.yml)，填模板。
2. **熟 Git**：把 `.md` 文件放到 `articles/` 下对应的 `🇩🇪` 开头的文件夹，提 PR。

详细约定见站内的 [投稿指南](https://stories.novawerk.io/submit)。

## 文件夹约定

- 稿件都放在 `articles/` 下。每个以 `🇩🇪` 开头的子文件夹是一个**栏目**。新栏目 = 新建这样的文件夹，不用改代码。
- 栏目里每个 `.md` 是一篇稿件。命名推荐 `N-标题.md`（章节顺序），正文第一行可以是 `N/标题` 或 `# 标题`，也可以直接开始正文。
- 栏目里可以放 `meta.json` 覆盖 slug / title / subtitle / tagline / order。
- 稿件可以在 `.md` 顶部加 frontmatter 覆盖 title / order / excerpt / slug。

`完整故事.md` 和 `修改意见.md` 被自动跳过（前者是合并产物，后者是 AI 编辑意见）。

## 本地预览

```bash
pnpm install
pnpm dev          # 自动触发 scripts/sync-content.mjs，然后开 http://localhost:3000
```

`pnpm dev` 和 `pnpm build` 都会先跑 `scripts/sync-content.mjs`——它扫描 `articles/` 下所有 🇩🇪 文件夹，把稿件按 slug 映射到 `content/`（被 `.gitignore`），让 Next.js 能 import。

## 部署

- 生产环境：`main` 分支推一次，Vercel 自动构建到 [stories.novawerk.io](https://stories.novawerk.io)。
- PR 预览：开 PR，Vercel 自动给每个 commit 生成一个预览 URL，评论到 PR 里。

## 技术栈

- **框架**：Next.js 16 App Router（静态预渲染，零运行时服务器负担）
- **样式**：Tailwind CSS + 霞鹜文楷 Screen（正文）+ 思源宋体（标题）
- **部署**：Vercel（Novawerk team · stories-about-chinese-in-germany）
- **投稿**：GitHub Issues + PR

## 版权

本作品采用 [知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh) 进行许可。提交稿件即表示同意以此协议发布。
