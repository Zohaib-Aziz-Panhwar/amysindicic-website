#!/usr/bin/env bash
#
# Copies the live site's content back into the repo.
#
# The client edits through https://amysindicic.com/admin/, which writes
# content/*.json on the server. Those files are the real ones; this repo's
# copies are only a record. Run this before editing content locally, and after
# the client has made changes, so git holds the current text.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

for f in content.json posts.json; do
  printf '  %-14s' "$f"
  curl -sk --max-time 60 "https://amysindicic.com/content/$f?v=$RANDOM" -o "public/content/$f.new"
  # A wrong path returns index.html with a 200, so check it really is JSON.
  if ! python -c "import json,io,sys; json.load(io.open('public/content/$f.new',encoding='utf-8'))" 2>/dev/null; then
    rm -f "public/content/$f.new"
    echo "not JSON — left alone"
    exit 1
  fi
  mv "public/content/$f.new" "public/content/$f"
  echo "pulled"
done

echo
git --no-pager diff --stat public/content/ || true
echo
echo "Review with: git diff public/content/"
