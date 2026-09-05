#!/usr/bin/env bash
#
# Publishes the hosted editor to https://amysindicic.com/admin/.
#
# Separate from deploy-bluehost.sh on purpose: the site is deployed often, the
# editor almost never, and the editor is the part with a login on it.
#
# Usage:  bash scripts/deploy-admin.sh
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

say "Generating the hosted editor from the local one"
node scripts/build-admin.mjs

say "Uploading"
for f in api.php index.php login.php app.js login.js blocks.js admin.css .htaccess; do
  printf '  %-12s' "$f"
  curl -sS --ftp-ssl-control --insecure --ftp-create-dirs --max-time 180 \
    -u "$FTP_USER:$FTP_PASS" \
    -T "deploy/admin/$f" "ftp://$FTP_HOST/$REMOTE_ROOT/admin/$f" \
    -w 'ok\n'
done

say "Uploading the site's .htaccess (carries the /admin passthrough)"
curl -sS --ftp-ssl-control --insecure --max-time 120 \
  -u "$FTP_USER:$FTP_PASS" \
  -T deploy/bluehost/.htaccess "ftp://$FTP_HOST/$REMOTE_ROOT/.htaccess"

say "Checking"
fail=0
check() {
  local path="$1" want="$2" label="$3"
  local code
  # A path may already carry a query, so pick the right separator.
  local sep='?'; case "$path" in *'?'*) sep='&';; esac
  code=$(curl -sk -o /dev/null -w '%{http_code}' --max-time 30 "https://amysindicic.com/${path}${sep}cb=$RANDOM" || echo 000)
  printf '  %-34s %s  %s\n' "/$path" "$code" "$label"
  [ "$code" = "$want" ] || fail=1
}
check "admin/login.php" 200 "sign-in page"
check "admin/api.php?a=session" 200 "session check"
# The editor's data must never be readable without a session.
code=$(curl -sk -o /dev/null -w '%{http_code}' --max-time 30 "https://amysindicic.com/admin/api.php?a=data" || echo 000)
printf '  %-34s %s  %s\n' "/admin/api.php?a=data" "$code" "must be 401 when signed out"
[ "$code" = "401" ] || fail=1
check "" 200 "the site still works"
check "old-site/" 200 "the archive still works"

echo
if [ "$fail" -eq 0 ]; then
  printf '\033[32mEditor deployed.\033[0m https://amysindicic.com/admin/\n\n'
else
  printf '\033[31mSomething is wrong -- do not hand this to the client yet.\033[0m\n\n'
  exit 1
fi
