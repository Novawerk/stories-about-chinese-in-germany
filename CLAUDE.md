# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository nature

This is a **Chinese-language writing project**, not a software project. It collects memoirs and essays about Chinese people living in Germany. Content lives in Markdown under three top-level, emoji-prefixed story collections:

- `🇩🇪创业往事-我开软件公司的七年/` — seven-year software-company memoir, the only collection with the full build pipeline
- `🇩🇪小厂打工人不定期汇报/` — essays on working at small German companies
- `🇩🇪再启程前的故事 - 在德国公司做管理/` — management at a German company

Folder and filenames are in Chinese (and include emoji) — always quote them in shell commands. Replies to the user should generally be in Chinese unless they write in English.

## Build pipeline (创业往事 only)

The 创业往事 collection has a chapter-assembly flow; the other two collections are plain prose with no build.

```
正文/*.md  ──(merge_chapters.py)──►  完整故事.md  ──(ai_review.py)──►  修改意见.md
```

- `scripts/merge_chapters.py` — concatenates every `.md` in `🇩🇪创业往事-我开软件公司的七年/正文/` (sorted by filename) into `完整故事.md`. Takes the first line of each chapter file as the chapter title; if it contains `/`, only the part after `/` is used. Writes a top-level `# 创业往事 - 我开软件公司的七年` header and `---` separators, then `git add`s the output.
- `scripts/ai_review.py` — sends `完整故事.md` to GPT-4o (requires `OPENAI_API_KEY`) as a literary editor and writes feedback to `修改意见.md`, then `git add`s it. Without the env var it writes a placeholder file rather than failing.
- `scripts/pre-commit-hook.sh` — runs both scripts in order. It is **not** auto-installed; wire it up with `ln -s ../../scripts/pre-commit-hook.sh .git/hooks/pre-commit` (or the equivalent for this worktree) if you want it active.

Run manually from the repo root:

```bash
python3 scripts/merge_chapters.py   # rebuild 完整故事.md
python3 scripts/ai_review.py        # regenerate 修改意见.md (needs OPENAI_API_KEY)
```

## Editing conventions

- **Never hand-edit `完整故事.md`** — it's a generated artifact. Edit the chapter files under `正文/` and rerun `merge_chapters.py`. (The one exception in git history is commit e24df9d, which the author did directly; treat it as a one-off.)
- **Chapter file naming**: `N-标题.md` (e.g. `0-引子.md`, `1-故事开始以前.md`). Sort order is lexical on the filename, so keep the numeric prefix.
- **Chapter title line**: the first line of each chapter file becomes the `##` heading in the merged output. `merge_chapters.py` strips anything before a `/`, so `引子/真正的标题` would render as `真正的标题`.
- When adding a new collection, mirror the 创业往事 layout (`正文/` + generated `完整故事.md`) only if you also plan to hook it into the scripts — otherwise a flat folder of Markdown files is fine (see the other two collections).
- Update `README.md`'s 目录 section when you add a new chapter or collection.

## License

Content is CC BY-NC-SA 4.0. Preserve attribution in any derivative.
