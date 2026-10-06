# My Blog

To see more informations you can go to my [blog](https://allefgomes.github.io/)

## Languages (EN / PT-BR)

English is the default; Portuguese lives under `/pt/`. The EN/PT switch in the nav jumps to the same page in the other language and remembers the reader's choice.

| | English | Português |
|---|---|---|
| Portfolio | `index.html` | `pt/index.html` |
| Posts | `_posts/<topic>/<date>-<slug>.md` → `/<slug>/` | `pt/_posts/<topic>/<date>-<slug>.md` → `/pt/<slug>/` |
| Blog list / tags | `blog/index.html`, `tags.html` | `pt/blog/index.html`, `pt/tags.html` |
| UI text (nav, labels) | `_data/i18n.yml` → `en:` | `_data/i18n.yml` → `pt:` |

To publish a post in both languages, create the two files with the **same filename** (so they share the slug) — one in `_posts/`, one in `pt/_posts/`. If a post exists in only one language, the switch sends readers to the other language's blog list instead.

Styles: `assets/css/base.css` holds the shared palette and shell; `portfolio.css` and `blog.css` hold page-specific styles.
