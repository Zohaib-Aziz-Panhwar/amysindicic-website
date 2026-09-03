#!/usr/bin/env bash
# Publishes the built site to the gh-pages branch of the parix remote.
#
# The branch also carries files this project does not build -- Amy's PDFs
# under assets/docs and the previous site's assets/img and assets/brand --
# so the build is copied OVER the branch rather than replacing it, and only
# superseded bundles are pruned.
set -euo pipefail

REMOTE=${REMOTE:-parix}
BRANCH=${BRANCH:-gh-pages}
# Named as owner/repo, never as a path: Git Bash rewrites a leading slash
# into a Windows path, which once shipped a base of /Program Files/Git/...
REPO=${REPO:-parix-ai/amy-site}
BASE="/${REPO#*/}/"
MSG=${1:?usage: deploy.sh "commit message"}

ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"

GITHUB_REPOSITORY="$REPO" npx vite build

# A wrong base still builds and still deploys -- it only fails in the
# browser -- so it has to be caught here.
if ! grep -q "src=\"${BASE}assets/" dist/index.html; then
  echo "Build has the wrong base path; expected ${BASE}. Refusing to deploy." >&2
  grep -o 'src="[^"]*"' dist/index.html >&2
  exit 1
fi
# GitHub Pages has no rewrite rules, so a deep link is served 404.html;
# an exact copy of index.html lets the router take over from there.
cp dist/index.html dist/404.html

git fetch "$REMOTE" "$BRANCH"
WT=$(mktemp -d)
trap 'git worktree remove --force "$WT" 2>/dev/null || true' EXIT
git worktree add --detach "$WT" "$REMOTE/$BRANCH" >/dev/null

cp -R dist/. "$WT"/

# Hashed bundles from the previous deploy are dead weight once the new ones land.
for f in "$WT"/assets/index-*.js "$WT"/assets/index-*.css; do
  [ -e "$f" ] || continue
  [ -e "dist/assets/$(basename "$f")" ] || rm -f "$f"
done

git -C "$WT" add -A
if git -C "$WT" diff --cached --quiet; then
  echo "Nothing to deploy."
  exit 0
fi
git -C "$WT" commit -q -m "$MSG"
git -C "$WT" push "$REMOTE" HEAD:"$BRANCH"
echo "Deployed to $BRANCH."
