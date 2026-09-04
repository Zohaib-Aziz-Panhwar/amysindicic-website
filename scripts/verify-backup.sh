#!/usr/bin/env bash
#
# Checks a downloaded WordPress backup is actually complete before anyone
# relies on it. A truncated phpMyAdmin export and a half-downloaded archive
# both look completely normal in a file listing.
#
# Usage:
#   bash scripts/verify-backup.sh backups/2026-09-04
#
# Expects that folder to hold the database dump (.sql or .sql.gz) and the file
# archive (.tar.gz or .zip) from cPanel, under any name.
set -uo pipefail

DIR="${1:?Usage: bash scripts/verify-backup.sh <folder>}"
[ -d "$DIR" ] || { echo "No such folder: $DIR" >&2; exit 1; }

problems=0
note() { printf '  %s\n' "$*"; }
ok()   { printf '  \033[32mOK\033[0m    %s\n' "$*"; }
bad()  { printf '  \033[31mFAIL\033[0m  %s\n' "$*"; problems=$((problems + 1)); }
head_of() { case "$1" in *.gz) gzip -dc "$1";; *) cat "$1";; esac; }

# GNU tar reads a leading "C:" as a remote host, which every Windows path has.
# --force-local fixes it, but bsdtar on macOS has no such option, so try both.
tar_list() { tar tzf "$1" 2>/dev/null || tar --force-local -tzf "$1" 2>/dev/null; }

echo
echo "Checking $DIR"
echo

# ------------------------------------------------------------------ database --
SQL="$(find "$DIR" -maxdepth 2 -type f \( -name '*.sql' -o -name '*.sql.gz' \) | head -1)"
echo "Database"
if [ -z "$SQL" ]; then
  bad "no .sql or .sql.gz found"
else
  note "file: $(basename "$SQL") ($(du -h "$SQL" | cut -f1))"

  if [ ! -s "$SQL" ]; then
    bad "the dump is empty"
  else
    tables=$(head_of "$SQL" | grep -c '^CREATE TABLE' || true)
    [ "$tables" -gt 0 ] && ok "$tables tables" || bad "no CREATE TABLE statements -- this is not a full dump"

    # WordPress core tables. A prefix other than wp_ is fine, so match loosely.
    for t in options posts postmeta users; do
      if head_of "$SQL" | grep -qE "^CREATE TABLE .*\`[a-zA-Z0-9_]*${t}\`"; then
        ok "table ...${t}"
      else
        bad "no ...${t} table -- the export may have been partial"
      fi
    done

    # mysqldump and phpMyAdmin both write a marker only after finishing. Its
    # absence is the signature of a download that stopped early.
    if head_of "$SQL" | tail -20 | grep -qiE 'Dump completed|-- *$|^/\*!40101 SET CHARACTER_SET_CLIENT'; then
      ok "ends cleanly"
    else
      bad "no completion marker at the end -- likely truncated"
    fi

    urls=$(head_of "$SQL" | grep -oc 'https\?://amysindicic\.com' || true)
    note "mentions of the site URL: $urls"
  fi
fi

# --------------------------------------------------------------------- files --
echo
echo "Files"
ARCHIVE="$(find "$DIR" -maxdepth 2 -type f \( -name '*.tar.gz' -o -name '*.tgz' -o -name '*.zip' \) | head -1)"
if [ -z "$ARCHIVE" ]; then
  bad "no .tar.gz or .zip found"
else
  note "file: $(basename "$ARCHIVE") ($(du -h "$ARCHIVE" | cut -f1))"

  case "$ARCHIVE" in
    *.zip) listing=$(unzip -l "$ARCHIVE" 2>/dev/null) ;;
    *)     listing=$(tar_list "$ARCHIVE") ;;
  esac

  if [ -z "$listing" ]; then
    bad "the archive does not read back -- it is corrupt or incomplete"
  else
    count=$(printf '%s\n' "$listing" | wc -l | tr -d ' ')
    ok "reads back cleanly, $count entries"
    for f in wp-config.php wp-content/themes wp-content/uploads wp-includes; do
      if printf '%s\n' "$listing" | grep -q "$f"; then
        ok "contains $f"
      else
        bad "no $f -- not a complete WordPress"
      fi
    done
  fi
fi

echo
if [ "$problems" -eq 0 ]; then
  printf '\033[32mBackup looks complete.\033[0m Keep it off shared drives: it holds database credentials.\n\n'
else
  printf '\033[31m%s problem(s). Do not migrate on this backup -- take it again.\033[0m\n\n' "$problems"
  exit 1
fi
