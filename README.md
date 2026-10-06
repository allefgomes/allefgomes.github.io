# My Blog

To see more informations you can go to my [blog](https://allefgomes.github.io/)

## Running locally

```sh
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.

## Writing a post

Create a file in `_posts/<topic>/<YYYY-MM-DD>-<slug>.markdown` (`.md` works too) with this front matter:

```yaml
---
layout: post
title: "Skills vs Agents, explained like you're five"
date: 2026-10-07 09:00:00 -0300
description: One sentence shown in the post list and link previews
img: software.jpg          # optional, relative to assets/img/
tags: [AI, Claude]
---
```

The `<topic>` folder only organizes the files; the URL is just `/<slug>/`.

**Scheduling a post:** Jekyll skips posts dated in the future, and the site is only rebuilt when something is pushed. So a post with tomorrow's date stays hidden until it is merged (or something else is pushed) on or after that date.

## Languages (EN / PT-BR)

English is the default; Portuguese lives under `/pt/`. The EN/PT switch in the nav jumps to the same page in the other language and remembers the reader's choice.

| | English | Português |
|---|---|---|
| Portfolio | `index.html` | `pt/index.html` |
| Posts | `_posts/<topic>/<date>-<slug>.markdown` → `/<slug>/` | `pt/_posts/<topic>/<date>-<slug>.markdown` → `/pt/<slug>/` |
| Blog list / tags | `blog/index.html`, `tags.html` | `pt/blog/index.html`, `pt/tags.html` |
| UI text (nav, labels) | `_data/i18n.yml` → `en:` | `_data/i18n.yml` → `pt:` |

To publish a post in both languages, create the two files with the **same filename** (so they share the slug) — one in `_posts/`, one in `pt/_posts/`. If a post exists in only one language, the switch sends readers to the other language's blog list instead.

Styles: `assets/css/base.css` holds the shared palette and shell; `portfolio.css` and `blog.css` hold page-specific styles.
