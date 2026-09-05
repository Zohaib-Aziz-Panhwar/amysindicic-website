# Moving amysindicic.com to the new site

The plan: **move** the existing WordPress site down into
`amysindicic.com/old-site/` where it keeps working as-is, and put the new React
site at the domain root. One WordPress, one database, no duplicate content.

**Nothing here has been run yet.** It needs Bluehost cPanel access.

## Read this first: the account hosts four sites

`amysindicic.com` is an **addon domain**. Its document root is

```
/home4/zrvpfwmy/public_html/amysindicic2
```

**not** `public_html`. `public_html` is the main domain,
`medicalenglish123.com`, which is a different live site.

| Domain | Document root | Database | Table prefix |
| --- | --- | --- | --- |
| medicalenglish123.com (main) | `public_html` | `zrvpfwmy_WPIMR` | `Xc0_` |
| **amysindicic.com** | **`public_html/amysindicic2`** | **`zrvpfwmy_WPDPP`** | **`sSD_`** |
| businessenglish123.com | `public_html/businessenglish123` | `zrvpfwmy_WPIQL` | `6pU_` |
| transformations123.com | `public_html/transformations123` | `zrvpfwmy_WP4WU` | `hGb_` |

Read from each site's `wp-config.php` on 2026-09-05, not guessed. Note the
table prefixes are **not** `wp_`: Amy's options table is `sSD_options`.

Everywhere below, "the site's folder" means `public_html/amysindicic2`.
Nothing in this job touches `public_html` itself or the other three sites.
An earlier draft of this runbook said to move the contents of `public_html`
into `old-site/` — doing that would have taken down medicalenglish123.com.

Six databases exist; the two not listed above are empty. The names carry no
hint of which site they serve, so always confirm from `wp-config.php`.

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

## Read this before starting

Moving WordPress touches the only copy of the database. Two things go wrong
often enough that they are worth naming up front.

**Never search-and-replace URLs with a text editor or `sed`.** WordPress stores
serialized PHP arrays, where every string is prefixed with its own byte length.
`s:24:"https://amysindicic.com"` becomes wrong the moment the URL gets longer,
and WordPress then silently discards the whole option. Theme settings, widgets
and page-builder layouts disappear. Without SSH the correct tool is the **Better
Search Replace** plugin, which unserializes properly. Step 4 uses it.

**Bluehost caches in two layers.** Endurance Cache and an nginx layer in front
of it. Skip the purge and visitors keep getting old pages after the switch,
which looks exactly like a broken deploy.

## The steps

### 1. Back up, and prove the backup is good

In cPanel:

1. **Backup Wizard → Back Up → Home Directory** → download the archive. This
   covers all four sites' files in one go.
2. **phpMyAdmin** → for **each** of the four databases above → **Export** →
   *Custom* → compression *none* → **Go**. Custom, not Quick, so the output is
   a complete dump with `CREATE TABLE` statements.

Keep each site's files and database in its own folder under
`backups/<date>/<domain>/`, so a restore never has to guess which dump belongs
to which site.

Put both files in a folder here and check them:

```bash
bash scripts/verify-backup.sh backups/2026-09-04
```

It confirms the archive reads back, the SQL dump is complete rather than
truncated, counts the tables, and finds the WordPress rows. **A backup nobody
has opened is not a backup** — a truncated phpMyAdmin export looks perfectly
normal until the day you need it.

`backups/` is git-ignored: the archive holds database credentials and salts.
Keep it off shared drives.

### 2. Note the database name

Open `public_html/amysindicic2/wp-config.php` in the cPanel File Manager and
note `DB_NAME`, `DB_USER`, `DB_HOST`. Nothing needs changing — the moved site keeps using the
same database — but you want them written down before moving anything.

### 3. Move WordPress into the subdirectory

In **File Manager**, inside `public_html/amysindicic2` — check the path in the
breadcrumb before selecting anything:

1. Create the folder `old-site`.
2. Select everything else in `amysindicic2` — **including the dotfiles**
   `.htaccess` and `.user.ini`; turn on *Settings → Show Hidden Files* first —
   and **Move** it into `old-site`.
3. `amysindicic2` should now contain only `old-site`.

The site is broken from here until step 5. It is the only window of downtime,
and it is short. The other three sites on the account are unaffected.

Edit `amysindicic2/old-site/.htaccess` so WordPress's own rules know where they
live — change the two `/` to `/old-site/`:

```apache
RewriteEngine On
RewriteBase /old-site/
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /old-site/index.php [L]
```

### 4. Point WordPress at its new address

In **phpMyAdmin**, open database `zrvpfwmy_WPDPP` and find the **`sSD_options`**
table — not `wp_options`, this install uses the `sSD_` prefix. Change the two
rows `siteurl` and `home`:

```
https://amysindicic.com   ->   https://amysindicic.com/old-site
```

`https://amysindicic.com/old-site/wp-admin/` should now log in. If it redirects
in a loop, those two values disagree — recheck them.

Then, inside wp-admin, install **Better Search Replace** and run:

```
Search for:   https://amysindicic.com
Replace with: https://amysindicic.com/old-site
Tables:       all
```

Run it **with "dry run" ticked first** and read the count it reports. Then run
it for real. This is what fixes the image URLs and internal links throughout the
content.

Guard against the one trap here: that search string also matches URLs that are
*already* `https://amysindicic.com/old-site`, turning them into
`/old-site/old-site`. So run it exactly once, and if you are unsure whether it
ran, check a media URL in the library rather than running it again.

### 5. Put the new site at the root

1. Build: `npm run build` — plain, no base path, which is what the config
   produces when `GITHUB_REPOSITORY` is unset.
2. Upload the **contents** of `dist/` into `public_html/amysindicic2` (the
   files, not the `dist` folder itself).
3. Upload `deploy/bluehost/.htaccess` as `amysindicic2/.htaccess`.
4. Purge Endurance Cache, and ask Bluehost support to purge the nginx layer.

### 6. Check, in this order

| Check | Why |
| --- | --- |
| `amysindicic.com/` | the new home page |
| `amysindicic.com/faqs` | **the real test.** A deep link proves the rewrite works. If it 404s, `.htaccess` is not being read or `mod_rewrite` is off, and nothing but the home page will work |
| `www.amysindicic.com/` | still 301s to the apex |
| `amysindicic.com/the-visibility-gap-why-qualified-leaders-get-overlooked/` | 301s to `/blog/...`; six of these are configured |
| `amysindicic.com/old-site/` | the archive, **with its images loading** — that is what proves step 4 worked |
| `amysindicic.com/old-site/wp-admin/` | Amy can still get in |

Hard-reload at least once, so you are not reading your own cache.

### Rolling back

Move everything out of `old-site` back into `amysindicic2`, delete the new
files, and set `siteurl`/`home` back to `https://amysindicic.com`. If the
content URLs were already rewritten, run Better Search Replace the other way,
or restore the database from step 1.

Keep the step 1 backup for at least a month.

## Worth doing once it is up

- **`noindex` on `/old-site/`.** Otherwise Google indexes a second copy of the
  same content and may rank it against the new site. Settings → Reading →
  *Discourage search engines* inside the moved WordPress.
- **Keep WordPress updated.** It is still live PHP with a commercial theme and
  plugins, on a site nobody is watching any more. If it is only ever for the
  client's reference, password-protecting `/old-site/` in cPanel removes most of
  that risk.
- **The other 15 posts and 63 pages** are not on the new site, so their old URLs
  now land on the React 404 page. Worth asking the client which still get
  traffic, and redirecting those to `/old-site/…` or their nearest new page.
- **GitHub Pages.** Once the domain serves from Bluehost,
  `parix-ai.github.io/amy-site/` is a staging copy. Keep it deliberately as
  that, or take it down so the two do not drift.

## What I need from you

- **cPanel login** (and FTP, if you want me to do the uploading).
- Ideally a **dedicated FTP account scoped to `public_html`** rather than the
  main account, and change the password once we are done.

I can prepare and check every step, but this is the client's live business
site — the switch itself is worth doing with you there rather than telling you
about it afterwards.

## Files in this repo for the migration

| | |
| --- | --- |
| `deploy/bluehost/.htaccess` | the new site's Apache config: SPA routing, `/old-site/` passthrough, the six article redirects, caching, `www` canonicalisation |
| `scripts/verify-backup.sh` | checks a downloaded backup is complete and readable |
| `scripts/backup-bluehost.sh` | one-command backup, if SSH is ever turned on |
