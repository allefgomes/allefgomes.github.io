# AI Agents for This Blog

This repo can be worked on by Hermes AI agents. The `blog-writer` profile specializes in creating and editing blog posts.

## `blog-writer` Profile

**Purpose**: Write and publish bilingual blog posts (EN and PT-BR) for https://allefgomes.github.io

**Location**: `~/.hermes/profiles/blog-writer/`

**Model**: Claude Haiku (Anthropic)

**Working directory**: `~/projects/allefgomes.github.io`

### What it does

- Drafts blog posts in Markdown, following Jekyll conventions
- Creates matching EN + PT-BR pairs (same filename, same date, translated content)
- Manages images: copies them to `/assets/img/<category>/` and references them correctly
- Commits changes with proper Git messages
- Edits existing posts if requested

### How to use it

```bash
# Start a chat
hermes -p blog-writer chat

# Or pipe a one-off command
echo "Draft a post about... " | hermes -p blog-writer chat
```

In the chat, just describe the post and let the profile handle the rest. For example:
- "Draft a post on X in the AI category"
- "Edit the most recent post and fix the typo in section 2"
- "Add an image to the Jogo de Prego post"

### Profile Configuration

**config.yaml**:
```yaml
model:
  default: claude-haiku-4-5-20251001
  provider: anthropic
_config_version: 50
```

**SOUL.md**: Full instructions at `~/.hermes/profiles/blog-writer/SOUL.md`. The profile knows:
- Jekyll structure (posts, categories, permalinks)
- Bilingual setup (EN in `_posts/`, PT in `pt/_posts/`)
- File naming and frontmatter format
- Image placement and linking
- Git commit conventions

**Skills it loads**:
- `Blog Post Workflow`: The definitive guide to the site's structure, multilingual routing, pitfalls, and post creation steps.

## Categories

Posts live in category subdirectories. Current categories in `_posts/`:
- `ai` — AI, agents, autonomy, Hermes, Claude
- `elixir` — Elixir, Phoenix, load testing
- `docker` — Docker, Compose
- `servers` — Raspberry Pi, Cloudflare, hosting
- `rust` — Rust language
- `lgpd` — LGPD (Brazilian privacy law)
- `talks` — Conference talks, presentations
- `programacao_funcional` — Functional programming
- `flameshot` — Linux, Flameshot

To create a post in a new category, create the directories first:
```bash
mkdir -p _posts/<new_category> pt/_posts/<new_category>
```

## Post Requirements

Every post **must** have:
1. **EN version**: `_posts/<category>/YYYY-MM-DD-slug.markdown`
2. **PT version**: `pt/_posts/<category>/YYYY-MM-DD-slug.markdown`
3. Same filename, same date
4. Translated title and content
5. Both versions published together in one commit

**No exceptions.** The multilingual setup assumes every post is available in both languages.

## Frontmatter Example

```markdown
---
layout: post
title: "Your Post Title Here"
date: 2026-10-16 14:00:00 -0300
description: One-line summary for the post preview
img: software.jpg
tags: [AI, Claude, Hermes]
---

## First Section (note: ## not #)

Content goes here...
```

- `title`: Translated per language
- `date`: Same for both EN and PT, format `YYYY-MM-DD HH:MM:SS -0300`
- `description`: Translated per language
- `img`: Same for both (file in `/assets/img/`)
- `tags`: Same for both

## Jekyll Configuration

**Permalink format** (in `_config.yml`):
```yaml
permalink: /:title/

defaults:
  - scope:
      path: "pt"
    values:
      lang: pt
      permalink: /pt/:title/
```

This generates:
- EN: `https://allefgomes.github.io/<slug>/`
- PT: `https://allefgomes.github.io/pt/<slug>/`

(No category prefix in the URL.)

## Git Workflow

1. Create EN and PT posts
2. Add images to `/assets/img/<category>/`
3. Stage everything: `git add -A`
4. Commit with message: `feat: add <title> post (EN and PT-BR, YYYY-MM-DD)`
5. Push to a feature branch (e.g., `post/<topic>`)
6. **Do NOT merge.** Allef reviews and merges PRs.

Example:
```bash
git add -A
git commit -m "feat: add Agentic Autonomy Levels post (EN and PT-BR, 2026-10-16)"
git push origin post/autonomy-levels
```

## Pitfalls

- **Missing PT version**: Every post needs both EN and PT. Commit together.
- **Different filenames**: Both versions must have the same filename and date to share the same slug.
- **Relative image paths**: Always use `/assets/img/<category>/`, never `./assets/`.
- **Category in URL**: If URLs show `/ai/slug/` instead of `/slug/`, the `_config.yml` permalink is set to `/:categories/:title/`. Update it to `/:title/`.
- **Same slug collision**: With proper Jekyll scope config, the same slug in `_posts/` and `pt/_posts/` generates different URLs (with `/pt/` prefix). If both land at the same URL, the scope config is missing or misconfigured.

## Skill: Blog Post Workflow

Load it to see the current setup, multilingual routing details, and the exact steps for creating a post:

```bash
hermes -p blog-writer chat
# Then say: Load the Blog Post Workflow skill for me
```

Or view directly:
```bash
hermes skill view "Blog Post Workflow"
```

It's your source of truth for the site's structure and any changes to the permalink or directory layout.
