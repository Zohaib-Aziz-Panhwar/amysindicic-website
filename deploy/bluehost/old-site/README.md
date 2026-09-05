# What is deployed inside `/old-site/`

The previous WordPress site, moved down from the domain root on 2026-09-05.
Two files there differ from what WordPress itself wrote:

**`.htaccess`** — `RewriteBase` and the front-controller rule point at
`/old-site/` instead of `/`. This copy is in the repo because WordPress
rewrites that file whenever permalinks are saved, and it will silently put
back `/`, which breaks every page but the front one.

**`wp-config.php`** — carries two added lines:

```php
define('WP_HOME', 'https://amysindicic.com/old-site');
define('WP_SITEURL', 'https://amysindicic.com/old-site');
```

These override `siteurl`/`home` in the database, which is why the move needed
**no database change at all** and no Better Search Replace pass. The database
still holds the original `https://amysindicic.com` values throughout, so the
whole move is undone by deleting these two lines and moving the files back up.

The site's own content still uses absolute `/wp-content/...` URLs. Rather than
rewrite those in the database, the root `.htaccess` sends `/wp-content`,
`/wp-includes`, `/wp-admin`, `/wp-login.php` and `/xmlrpc.php` into
`/old-site/`, so the archive keeps its images and its admin login.
