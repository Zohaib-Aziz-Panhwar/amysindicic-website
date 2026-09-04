# Moving amysindicic.com to the new site

The plan: the React site serves `amysindicic.com`, and the existing WordPress
site is kept at `amysindicic.com/old-site/`, with a full backup held separately.

**Nothing here is done yet.** It needs Bluehost access — see *What I need* at
the bottom.

## What is there now

Checked from the public side on 2026-09-04:

| | |
| --- | --- |
| Host | Bluehost shared, Apache |
| Platform | WordPress, `educationwp` theme |
| Content | 21 posts, 63 pages, 406 media items |
| Caching | Endurance Cache plus an nginx layer in front |
| Canonical host | `www.` already 301s to the apex `amysindicic.com` |
| `/old-site/` | free (404) |

## The order that matters

The principle: **the live site is not touched until its replacement is already
working and proven.** Every step before the cutover is additive, and the
cutover itself is a rename that reverses in seconds.

### 1. Back up, and check the backup

```bash
SSH_HOST=user@amysindicic.com bash scripts/backup-bluehost.sh
```

Read-only against the live site. Produces `backups/<timestamp>/` with
`database.sql`, `files.tar.gz` and a `MANIFEST.txt`, verifying checksums
against the server, that the dump carries mysqldump's completion marker, and
that the archive reads back.

Also take a backup through **cPanel → Backup** as a second copy from a
different mechanism. Two backups by two routes, because this is the step that
makes everything after it reversible.

Do not continue until you have restored the dump into a scratch database
somewhere and seen it load. An unverified backup is not a backup.

`backups/` is git-ignored — the archive contains database credentials and
WordPress salts. Keep it off shared drives.

### 2. Stand the archive up beside the live site, not on top of it

Still additive; the live site keeps running throughout.

1. Copy the WordPress files into `public_html/old-site/`.
2. Create a **second, empty database**, import `database.sql` into it, and
   point `old-site/wp-config.php` at that one. The archive must not share a
   database with the live site, or step 3 changes both.
3. Rewrite the URLs in the copy:

   ```bash
   cd ~/public_html/old-site
   wp search-replace 'https://amysindicic.com' 'https://amysindicic.com/old-site' --all-tables --dry-run
   wp search-replace 'https://amysindicic.com' 'https://amysindicic.com/old-site' --all-tables
   ```

   **Use `wp search-replace`, never `sed` on the dump.** WordPress stores
   serialized PHP arrays whose strings carry byte lengths; a plain text replace
   changes the string but not the length, and every widget, theme option and
   page builder layout that touches a URL breaks. If wp-cli is not available on
   the plan, the *Better Search Replace* plugin does the same job correctly.

4. Visit `https://amysindicic.com/old-site/`. Check the front page, an interior
   page, an article, images, and `/old-site/wp-admin`. Fix it here, while the
   real site is still untouched.

### 3. Cut over

1. Turn off Endurance Cache and purge it, and ask Bluehost support to purge the
   nginx layer. Skip this and visitors keep getting the old page from cache
   after the switch, which reads exactly like a failed deploy.
2. Build for the domain root — plain `npm run build`, no base path, which is
   already what an unset `GITHUB_REPOSITORY` produces.
3. Move the old WordPress files *out* of `public_html` (rename to
   `public_html_wp_old`, do not delete). The copy at `/old-site/` is what
   serves now.
4. Upload `dist/` into `public_html`, and `deploy/bluehost/.htaccess` as
   `public_html/.htaccess`.

### 4. Check, in this order

- `https://amysindicic.com/` — the new home page
- `https://amysindicic.com/faqs` — **the real test.** A deep link proves the
  rewrite works. If it 404s, `.htaccess` is not being read or `mod_rewrite` is
  off, and nothing but the home page will work.
- `https://www.amysindicic.com/` — still 301s to the apex
- `https://amysindicic.com/the-visibility-gap-why-qualified-leaders-get-overlooked/`
  — 301s to `/blog/...`; six of these are configured
- `https://amysindicic.com/old-site/` — the archive, with images
- Hard-reload once, to be sure you are not reading your own cache

### Rolling back

Until step 3.3 is undone, the entire old site still exists at
`public_html_wp_old`. Rolling back is renaming it back and removing the new
files — seconds, no restore needed. That is the whole reason for the ordering
above. Keep it for at least a couple of weeks.

## Decisions worth making first

**A live old WordPress is an ongoing liability.** It keeps running PHP, a
database, a commercial theme and its plugins, all of which need updating, on a
site nobody is watching any more. Three options:

1. **Keep it live at `/old-site/`** — what is described above. Most faithful,
   most upkeep, and it is the option that can be hacked.
2. **Freeze it to static HTML** — crawl it once (`wget --mirror`) and serve
   flat files. Looks identical, nothing to exploit or update. Forms and search
   stop working, which for an archive rarely matters. **My recommendation.**
3. **Back it up but do not publish it** — the safest, if `/old-site/` is only
   ever meant for the client's own reference.

If it does stay live, at minimum password-protect `/old-site/` in cPanel and
add `noindex` so Google does not index a second copy of the content and rank it
against the new site.

**The other 15 posts and 63 pages** are not on the new site. Right now they
would land on the React 404 page. Options are to redirect the ones that matter
to their nearest new page, or send everything unmatched to `/old-site/…`. Worth
deciding with the client which old URLs still get traffic.

**GitHub Pages.** Once the domain serves from Bluehost, the
`parix-ai.github.io/amy-site/` copy is a staging site. Either keep it as that
deliberately, or take it down so two versions do not drift apart.

## What I need to do it

- **SSH access** (host, username, and a key or password) — the plan above uses
  it. Failing that, cPanel and FTP credentials, and it becomes manual.
- Confirmation of **which of the three archive options** you want.
- Confirmation of **who runs the cutover.** I can prepare and verify every
  step, but this is the client's live business site, and the moment of switching
  is worth doing with you present rather than announcing afterwards.

## Files this repo already has ready

| | |
| --- | --- |
| `deploy/bluehost/.htaccess` | Apache config for the document root: SPA routing, `/old-site/` passthrough, the six article redirects, caching, `www` canonicalisation |
| `scripts/backup-bluehost.sh` | the verified backup in step 1 |
