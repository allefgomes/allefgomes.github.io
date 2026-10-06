#!/usr/bin/env bash
# Fails when a post exists in only one language.
# English posts live in _posts/, Portuguese in pt/_posts/. A post's URL comes from its
# filename minus the date (/:title/ and /pt/:title/), so that is what pairs the two versions.
set -euo pipefail
cd "$(dirname "$0")/../.."

slugs() {
  find "$1" -type f \( -name '*.md' -o -name '*.markdown' \) -printf '%f\n' \
    | sed -E 's/^[0-9]{4}-[0-9]{2}-[0-9]{2}-//; s/\.(md|markdown)$//' | sort
}

missing_pt=$(comm -23 <(slugs _posts) <(slugs pt/_posts))
missing_en=$(comm -13 <(slugs _posts) <(slugs pt/_posts))

status=0
if [[ -n "$missing_pt" ]]; then
  echo "Missing Portuguese version (pt/_posts/) of:"
  sed 's/^/  - /' <<<"$missing_pt"
  status=1
fi
if [[ -n "$missing_en" ]]; then
  echo "Missing English version (_posts/) of:"
  sed 's/^/  - /' <<<"$missing_en"
  status=1
fi
if [[ $status -eq 0 ]]; then
  echo "All $(slugs _posts | wc -l) posts exist in both languages."
fi
exit $status
