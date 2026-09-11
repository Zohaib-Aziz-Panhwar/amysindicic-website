#!/usr/bin/env bash
#
# Publishes the site to amysindicic.com on Bluehost over FTP.
#
# Uploads only the built site into the domain's document root. It never
# touches old-site/, which holds the previous WordPress, and it uploads the
# repo's own .htaccess rather than dist/'s, because the deployed one carries
# the rules that forward /wp-content and friends into the archive.
#
# Credentials come from the environment, or from deploy/bluehost/.ftp-credentials
# (git-ignored), which should read:
#
#   FTP_USER=dev@amysindicic.com
#   FTP_PASS=...
#
# Usage:  bash scripts/deploy-bluehost.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

CRED="deploy/bluehost/.ftp-credentials"
[ -f "$CRED" ] && . "$CRED"

FTP_HOST="${FTP_HOST:-amysindicic.com}"
REMOTE_ROOT="${REMOTE_ROOT:-public_html/amysindicic2}"
: "${FTP_USER:?Set FTP_USER, or create $CRED}"
: "${FTP_PASS:?Set FTP_PASS, or create $CRED}"

say() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }

say "Building"
npm run build

# A wrong base path builds and uploads happily and only fails in the browser,
# so check before anything leaves this machine.
if ! grep -q 'src="/assets/' dist/index.html; then
  echo "Built index.html does not reference /assets/ -- wrong base path. Refusing." >&2
  grep -o 'src="[^"]*"' dist/index.html >&2
  exit 1
fi

# GitHub Pages needs 404.html; Apache does the same job through .htaccess, and
# an extra copy would only go stale.
rm -f dist/404.html dist/.htaccess

# Content belongs to whoever is editing the live site, not to this repo. The
# client edits through /admin/, which writes content/*.json on the server; if a
# deploy shipped the repo's copies it would silently undo her work. Pull her
# changes down with scripts/pull-content.sh instead.
#
# Pass --with-content only to seed a site that has none yet.
if [ "${1:-}" = "--with-content" ]; then
  say "Including content/ (seeding)"
else
  rm -rf dist/content
fi

say "Preparing the upload list"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
CFG="$TMP/upload.cfg"

# Written with forward slashes: a curl config file reads a backslash as an
# escape, which silently mangles every output path.
python - "$CFG" "$REMOTE_ROOT" <<'PY'
import io, os, sys
cfg, remote_root = sys.argv[1], sys.argv[2]
BS = chr(92)
n = 0
with io.open(cfg, 'w', encoding='utf-8', newline='\n') as f:
    for dirpath, _, names in os.walk('dist'):
        for name in names:
            local = os.path.join(dirpath, name)
            rel = os.path.relpath(local, 'dist').replace(BS, '/')
            f.write('url = "ftp://%s/%s/%s"\n' % (os.environ.get('FTP_HOST', 'amysindicic.com'), remote_root, rel))
            f.write('upload-file = "%s"\n' % os.path.abspath(local).replace(BS, '/'))
            n += 1
print('%d files' % n)
PY

say "Uploading the built site"
# The host throttles per file, so this takes a few minutes even though the
# payload is small. Control channel is encrypted; the data channel is not,
# which is what keeps it from being far slower still.
curl -sS --ftp-ssl-control --insecure --ftp-create-dirs --max-time 1800 \
  -u "$FTP_USER:$FTP_PASS" -K "$CFG"

say "Uploading .htaccess"
curl -sS --ftp-ssl-control --insecure --max-time 120 \
  -u "$FTP_USER:$FTP_PASS" \
  -T deploy/bluehost/.htaccess "ftp://$FTP_HOST/$REMOTE_ROOT/.htaccess"

say "Checking the live site"
fail=0
for path in "" "faqs" "blog" "old-site/"; do
  code=$(curl -sk -o /dev/null -w '%{http_code}' --max-time 30 "https://amysindicic.com/$path?cb=$RANDOM" || echo 000)
  printf '  %-14s %s\n' "/$path" "$code"
  # A deep link proves the rewrite still works; the archive proves we did not
  # tread on it.
  [ "$code" = "200" ] || fail=1
done

echo
if [ "$fail" -eq 0 ]; then
  printf '\033[32mDeployed.\033[0m https://amysindicic.com/\n\n'
else
  printf '\033[31mSomething is not answering 200 -- check before telling the client.\033[0m\n\n'
  exit 1
fi
