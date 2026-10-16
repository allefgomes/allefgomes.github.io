# My Blog

To see more informations you can go to my [blog](https://allefgomes.github.io/)

## Writing Posts

**Use the `blog-writer` Hermes profile.** Run `hermes -p blog-writer chat` to start drafting or editing posts.

The profile knows the Jekyll setup, the multilingual structure, and will guide you through creating matching EN/PT-BR pairs.

To draft a post manually:
1. Load the `Blog Post Workflow` skill (in Hermes, it auto-loads).
2. Create EN version: `_posts/<category>/YYYY-MM-DD-slug.markdown`
3. Create PT version: `pt/_posts/<category>/YYYY-MM-DD-slug.markdown`
4. Same filename, same date, **translated content**.
5. Use `![alt](/assets/img/<category>/image.jpg)` for images (absolute path from site root).
6. Commit: `git commit -am "feat: add <title> post (EN and PT-BR, YYYY-MM-DD)"`

**Every post must have both EN and PT-BR versions.** No exceptions.

## Languages (EN / PT-BR)

English is the default; Portuguese lives under `/pt/`. The EN/PT switch in the nav jumps to the same page in the other language and remembers the reader's choice.

| | English | Português |
|---|---|---|
| Portfolio | `index.html` | `pt/index.html` |
| Posts | `_posts/<category>/<date>-<slug>.md` → `/<slug>/` | `pt/_posts/<category>/<date>-<slug>.md` → `/pt/<slug>/` |
| Blog list / tags | `blog/index.html`, `tags.html` | `pt/blog/index.html`, `pt/tags.html` |
| UI text (nav, labels) | `_data/i18n.yml` → `en:` | `_data/i18n.yml` → `pt:` |

To publish a post in both languages, create the two files with the **same filename** (so they share the slug) — one in `_posts/`, one in `pt/_posts/`. If a post exists in only one language, the switch sends readers to the other language's blog list instead.

Styles: `assets/css/base.css` holds the shared palette and shell; `portfolio.css` and `blog.css` hold page-specific styles.
