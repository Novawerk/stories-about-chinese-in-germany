import Link from 'next/link';
import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: '投稿指南',
  description: '如何向《德华故事集》提交你的故事。',
};

export default function SubmitPage() {
  return (
    <div className="paper-texture">
      <header className="relative z-10 border-b border-ink pt-12 pb-8">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/" className="eyebrow text-ink/50 hover:text-accent">
            ← 回到首页
          </Link>
          <div className="mt-8 eyebrow text-ink/50">Contribute · 投稿</div>
          <h1 className="mt-4 nameplate text-[clamp(2.5rem,8vw,5rem)] leading-[0.95]">
            把你的故事
            <br />
            写进来。
          </h1>
          <p className="mt-8 font-serif text-lg leading-relaxed text-ink/80">
            这是一本长期更新的集子——任何在德国生活、工作、挣扎、相爱过的华人，
            都可以把自己的一段故事交给我们。审稿流程完全公开，在 GitHub 上进行。
          </p>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto max-w-3xl px-6 py-16 space-y-16">
          <Path
            step="01"
            title="最简单的方式：开一个 Issue"
            body="不想和 Git 打交道？直接用 Issue 模板把文字贴进来，我们帮你整理成稿件。"
            cta={{ href: site.issueNewStory, label: '打开投稿 Issue →' }}
          />

          <Path
            step="02"
            title="熟悉 Git：直接开 Pull Request"
            body="在仓库的 articles/ 下找到或新建对应的 🇩🇪 开头的文件夹，把稿件放进去，开个 PR。我们会在 PR 里和你一起打磨。"
            cta={{ href: site.repo, label: '打开 GitHub 仓库 →' }}
          />

          <Convention />
          <License />
        </div>
      </section>
    </div>
  );
}

function Path({
  step,
  title,
  body,
  cta,
}: {
  step: string;
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr] md:gap-10">
      <div className="nameplate text-5xl text-accent/80 md:text-6xl">{step}</div>
      <div>
        <h2 className="nameplate text-2xl md:text-3xl">{title}</h2>
        <p className="mt-4 font-serif text-lg leading-relaxed text-ink/75">
          {body}
        </p>
        <a
          href={cta.href}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block eyebrow border-b border-ink pb-1 text-ink hover:border-accent hover:text-accent"
        >
          {cta.label}
        </a>
      </div>
    </div>
  );
}

function Convention() {
  const rules: Array<[string, string]> = [
    ['栏目', 'articles/ 下每个 🇩🇪 开头的文件夹是一个栏目。新开栏目就是新建一个这样的文件夹。'],
    [
      '稿件',
      '每篇稿件是一个 .md 文件。文件名用 `N-标题.md`，其中 N 是章节顺序；正文第一行写 `N/标题` 或 `# 标题` 都行，不写也没关系——会用文件名补上。',
    ],
    [
      '栏目元信息',
      '栏目文件夹里可以放 `meta.json`，覆盖 slug、title、subtitle、tagline、order——不放就用默认值。',
    ],
    [
      '稿件元信息',
      '稿件可以在 Markdown 前面加 frontmatter：title、order、excerpt、slug——自定义展示更精确。',
    ],
  ];
  return (
    <div className="border-t border-ink/15 pt-16">
      <div className="eyebrow text-ink/50">约定 · Convention</div>
      <h2 className="mt-3 nameplate text-3xl md:text-4xl">一些文件排布的规矩</h2>
      <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
        {rules.map(([k, v]) => (
          <div
            key={k}
            className="grid grid-cols-1 gap-2 py-5 md:grid-cols-[8rem_1fr] md:gap-8"
          >
            <dt className="eyebrow text-ink/50">{k}</dt>
            <dd className="font-serif text-[1.0625rem] leading-relaxed text-ink/80">
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function License() {
  return (
    <div className="border border-ink/15 bg-paper-warm/60 p-8">
      <div className="eyebrow text-ink/50">版权 · License</div>
      <p className="mt-3 font-serif text-base leading-relaxed text-ink/80">
        提交稿件即表示同意以{' '}
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
          className="underline decoration-ink/40 hover:text-accent hover:decoration-accent"
          target="_blank"
          rel="noreferrer"
        >
          {site.license}
        </a>{' '}
        许可发布。保留署名，非商业使用，衍生作品需同样许可。
      </p>
    </div>
  );
}
