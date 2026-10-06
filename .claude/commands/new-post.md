---
description: Create a new blog post in English and Portuguese (PT-BR)
argument-hint: <topic> <title or idea, in either language>
---

Create a new blog post in both languages from: $ARGUMENTS

1. Work out the topic folder (reuse an existing one under `_posts/` when it fits), the English and Portuguese titles, a one-line description in each language, and tags in the style of existing posts (e.g. `TIL, Docker`). Pick a short snake_case English slug.
2. Scaffold both files with the script, which enforces the shared filename and front matter:
   `.github/scripts/new-post.sh -s <slug> -d "<EN description>" -D "<PT description>" -t "<tags>" [-i <topic>/<image>] <topic> "<EN title>" "<PT title>"`
3. If I gave content (or enough of an idea to write from), replace the placeholder body in both files: write it in the language I used, then translate it faithfully to the other. Keep code blocks, commands and links identical in both. Otherwise leave the placeholders.
4. Run `.github/scripts/check-translations.sh` and report the two file paths and their URLs (`/<slug>/` and `/pt/<slug>/`).
