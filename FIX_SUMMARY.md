# Jekyll 404 Fix: Agentic Autonomy Levels Post

## Problem Summary
Posts at `/agentic-autonomy-levels/` and `/pt/agentic-autonomy-levels/` were returning 404 errors despite files existing in the repository.

## Root Cause
Jekyll generates URLs from post filenames. The original structure used language-suffixed filenames which generated incorrect URLs:

**Wrong structure:**
```
_posts/ai/2026-10-16-agentic-autonomy-levels-en.md  → /agentic-autonomy-levels-en/
_posts/ai/2026-10-16-agentic-autonomy-levels-pt.md  → /agentic-autonomy-levels-pt/
pt/_posts/ai/2026-10-16-agentic-autonomy-levels-*.md → also wrong
```

User was requesting `/agentic-autonomy-levels/` but URLs had `-en` and `-pt` suffixes, causing 404s.

## Solution Applied

### 1. Removed duplicate/malformed files
- Deleted underscore-based file `2026-10-16-agentic_autonomy_levels.markdown` from both `_posts/ai/` and `pt/_posts/ai/`
- Removed language-suffixed variants `-en.md` and `-pt.md`

### 2. Consolidated to correct bilingual structure
Jekyll's bilingual pattern: same filename in different language directories.

**Correct structure:**
```
_posts/ai/2026-10-16-agentic-autonomy-levels.md   → /agentic-autonomy-levels/ (EN)
pt/_posts/ai/2026-10-16-agentic-autonomy-levels.md → /pt/agentic-autonomy-levels/ (PT)
```

### 3. Fixed frontmatter
- Updated image references from `agentic-autonomy.png` to `agentic_autonomy_levels.jpg`
- Ensured correct language titles in each file
- Maintained date format consistency

### 4. Git commits
- Commit 1: Initial cleanup of duplicate/broken versions
- Commit 2: Consolidation to correct bilingual pattern

## Validation Results

✓ **File structure correct:**
- `_posts/ai/2026-10-16-agentic-autonomy-levels.md` (English)
- `pt/_posts/ai/2026-10-16-agentic-autonomy-levels.md` (Portuguese)

✓ **URL slugs match site requests:**
- Generated slug: `agentic-autonomy-levels`
- EN URL: `/agentic-autonomy-levels/` ✓
- PT URL: `/pt/agentic-autonomy-levels/` ✓

✓ **Image asset found:**
- `/assets/img/ai/agentic_autonomy_levels.jpg` ✓

✓ **Old broken files deleted:**
- All `-en`, `-pt`, and underscore variants removed ✓

## Expected Outcome

After GitHub Pages rebuilds, the following URLs are now accessible:
- **https://allefgomes.github.io/agentic-autonomy-levels/** (English)
- **https://allefgomes.github.io/pt/agentic-autonomy-levels/** (Portuguese)

The fix aligns with the site's existing bilingual structure used by other posts (e.g., `hermes-telegram-topics`).

## Related Files
- `_config.yml`: Confirms `permalink: /:title/` and PT scope `permalink: /pt/:title/`
- `Blog Post Workflow` skill: Documents correct bilingual post structure
