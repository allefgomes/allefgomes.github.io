#!/usr/bin/env bash
# Creates a new post in both languages: _posts/<topic>/ (EN) and pt/_posts/<topic>/ (PT-BR).
# Both files get the same filename so they share the slug (/<slug>/ and /pt/<slug>/).
set -euo pipefail
cd "$(dirname "$0")/../.."

usage() {
  cat <<EOF
Usage: $(basename "$0") [options] <topic> "<English title>" ["<Portuguese title>"]

  <topic>               folder under _posts/ and pt/_posts/ (e.g. docker, elixir)

Options:
  -s <slug>             URL slug (default: derived from the English title)
  -d <description>      English description
  -D <descrição>        Portuguese description
  -t <tags>             comma-separated tags, e.g. "TIL, Docker"
  -i <img>              image path relative to assets/img/ (e.g. docker/cover.png)
  -x <ext>              file extension: markdown (default) or md
EOF
  exit 1
}

slug="" desc="" desc_pt="" tags="" img="" ext="markdown"
while getopts "s:d:D:t:i:x:h" opt; do
  case $opt in
    s) slug=$OPTARG ;;
    d) desc=$OPTARG ;;
    D) desc_pt=$OPTARG ;;
    t) tags=$OPTARG ;;
    i) img=$OPTARG ;;
    x) ext=$OPTARG ;;
    *) usage ;;
  esac
done
shift $((OPTIND - 1))
[[ $# -ge 2 ]] || usage

topic=$1 title=$2 title_pt=${3:-$2}
[[ $ext == markdown || $ext == md ]] || { echo "Extension must be markdown or md" >&2; exit 1; }

if [[ -z $slug ]]; then
  slug=$(iconv -f utf-8 -t ascii//TRANSLIT <<<"$title" | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/_/g; s/^_+|_+$//g')
fi
[[ -n $slug ]] || { echo "Could not derive a slug; pass one with -s" >&2; exit 1; }

# The slug is the URL, so it must be unique across every topic and date.
existing=$(find _posts pt/_posts -type f \( -name "*-$slug.md" -o -name "*-$slug.markdown" \) \
  | grep -E "/[0-9]{4}-[0-9]{2}-[0-9]{2}-$slug\.(md|markdown)$" || true)
if [[ -n $existing ]]; then
  echo "A post with slug '$slug' already exists:" >&2
  sed 's/^/  - /' <<<"$existing" >&2
  exit 1
fi

filename="$(date +%F)-$slug.$ext"
datetime=$(date '+%F %T %z')

yaml_quote() { local s=${1//\\/\\\\}; printf '"%s"' "${s//\"/\\\"}"; }

write_post() { # <path> <title> <description> <body>
  mkdir -p "$(dirname "$1")"
  cat >"$1" <<EOF
---
layout: post
title: $(yaml_quote "$2")
date: $datetime
description: $(yaml_quote "$3")
img: $img
tags: [$tags]
---

$4
EOF
  echo "Created $1"
}

write_post "_posts/$topic/$filename" "$title" "$desc" "Write the English version here."
write_post "pt/_posts/$topic/$filename" "$title_pt" "$desc_pt" "Escreva a versão em português aqui."

if [[ -n $img && ! -f assets/img/$img ]]; then
  echo "Note: assets/img/$img does not exist yet."
fi
