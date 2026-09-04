#!/usr/bin/env bash
#
# Takes a full backup of the WordPress site on Bluehost -- files and database --
# and downloads it here. Read-only as far as the live site is concerned: the
# only thing it writes on the server is an archive in a temp directory outside
# the web root, which it removes afterwards.
#
# Run this, and check it, BEFORE anything is moved or deleted.
#
# Usage:
#   SSH_HOST=user@host SSH_PORT=22 bash scripts/backup-bluehost.sh
#
# Optional:
#   REMOTE_DOCROOT   default ~/public_html
#   OUT              default backups/<timestamp>
set -euo pipefail

: "${SSH_HOST:?Set SSH_HOST, e.g. SSH_HOST=amysind@amysindicic.com}"
SSH_PORT="${SSH_PORT:-22}"
REMOTE_DOCROOT="${REMOTE_DOCROOT:-public_html}"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="${OUT:-backups/$STAMP}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p "$OUT"

SSH=(ssh -p "$SSH_PORT" -o BatchMode=yes "$SSH_HOST")
say() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }

say "Checking the connection and finding WordPress"
"${SSH[@]}" "test -f '$REMOTE_DOCROOT/wp-config.php'" \
  || { echo "No wp-config.php under $REMOTE_DOCROOT on $SSH_HOST." >&2; exit 1; }

# Credentials are read on the server and used there; they are never printed
# and never travel back over the wire.
say "Reading the database name from wp-config.php"
DB_NAME="$("${SSH[@]}" "php -r \"define('ABSPATH',1); include '$REMOTE_DOCROOT/wp-config.php'; echo DB_NAME;\"" 2>/dev/null || true)"
[ -n "$DB_NAME" ] && echo "    database: $DB_NAME" || echo "    (could not read it; the dump below still uses the file directly)"

say "Dumping the database on the server"
REMOTE_TMP="$("${SSH[@]}" 'mktemp -d')"
"${SSH[@]}" "cd '$REMOTE_DOCROOT' && php -r \"
  define('ABSPATH', 1); include 'wp-config.php';
  \\\$cmd = sprintf('mysqldump --no-tablespaces --single-transaction --default-character-set=utf8mb4 -h%s -u%s -p%s %s',
    escapeshellarg(DB_HOST), escapeshellarg(DB_USER), escapeshellarg(DB_PASSWORD), escapeshellarg(DB_NAME));
  passthru(\\\$cmd . ' > $REMOTE_TMP/database.sql 2> $REMOTE_TMP/mysqldump.err', \\\$rc);
  exit(\\\$rc);
\"" || { echo "mysqldump failed:" >&2; "${SSH[@]}" "cat $REMOTE_TMP/mysqldump.err" >&2; exit 1; }

say "Archiving the files on the server"
# wp-config.php is included deliberately -- a restore needs it. Treat the
# backup as secret: it holds database credentials and salts.
"${SSH[@]}" "cd '$REMOTE_DOCROOT' && tar czf '$REMOTE_TMP/files.tar.gz' \
  --exclude='./wp-content/cache' \
  --exclude='./wp-content/uploads/backup*' \
  --exclude='./.git' \
  ."

say "Downloading"
scp -P "$SSH_PORT" -q "$SSH_HOST:$REMOTE_TMP/database.sql" "$OUT/database.sql"
scp -P "$SSH_PORT" -q "$SSH_HOST:$REMOTE_TMP/files.tar.gz" "$OUT/files.tar.gz"

say "Verifying what arrived"
REMOTE_SUM="$("${SSH[@]}" "cd $REMOTE_TMP && md5sum database.sql files.tar.gz" | awk '{print $1}')"
LOCAL_SUM="$(md5sum "$OUT/database.sql" "$OUT/files.tar.gz" | awk '{print $1}')"
[ "$REMOTE_SUM" = "$LOCAL_SUM" ] || { echo "Checksums differ. The download is not trustworthy." >&2; exit 1; }

# A truncated dump is the classic silent failure, so look for the end marker
# mysqldump writes only when it finished.
grep -q "Dump completed" "$OUT/database.sql" \
  || { echo "The dump has no completion marker; it is truncated." >&2; exit 1; }

tar tzf "$OUT/files.tar.gz" >/dev/null \
  || { echo "The file archive does not read back cleanly." >&2; exit 1; }

say "Cleaning up the server"
"${SSH[@]}" "rm -rf $REMOTE_TMP"

{
  echo "host:      $SSH_HOST"
  echo "docroot:   $REMOTE_DOCROOT"
  echo "database:  ${DB_NAME:-unknown}"
  echo "taken:     $(date -u +'%Y-%m-%d %H:%M:%SZ')"
  echo "sql bytes: $(wc -c < "$OUT/database.sql")"
  echo "sql tables: $(grep -c '^CREATE TABLE' "$OUT/database.sql")"
  echo "files:     $(tar tzf "$OUT/files.tar.gz" | wc -l)"
} > "$OUT/MANIFEST.txt"

say "Done"
cat "$OUT/MANIFEST.txt"
echo
echo "Saved to $OUT"
echo "This backup contains database credentials. Keep it out of git and off shared drives."
