# Site editor

A local editor for the site's words and photos, so routine content changes do
not need a code edit.

```
npm run admin
```

That starts two things:

| | |
| --- | --- |
| `http://localhost:5174` | the editor |
| `http://localhost:5173` | the site itself, shown in the preview pane |

Edit on the left, watch the real site on the right. **Save** writes the changes
to disk; the preview reloads a moment later. Nothing reaches the live site until
you deploy:

```
bash scripts/deploy.sh "what changed"
```

Stop both with Ctrl+C.

## What it edits

- **Blog** — posts, their cover photos, and the article text. Reorder or delete.
- **Testimonials** — name, role, date, photo, star rating, quote.
- **FAQs** — the questions and answers, and their order.
- **About** — portrait, biography, philosophy quote.
- **Home** — hero photo and headline, banner, services, audiences, approach
  steps, closing band.

Deliberately *not* editable: the logo, the butterfly artwork, navigation, and
the booking link. Those are design, not content, and a wrong value there breaks
a layout rather than reading badly.

## Writing an article

The article box is plain text with four conventions:

```
A blank line between paragraphs.

## A heading

> A pull quote

- a list item
- another item
```

Everything else is a paragraph. This is converted to the blocks the site
renders and back again, without loss — verified against all 481 blocks in the
existing posts.

## Photos

Pick a file and it is resized in the browser before it is saved, so a phone
photo does not land in the repo at full size. Each slot has its own target:
testimonial portraits 300px, blog covers 1400px, the About portrait 900px, the
hero 1800px.

Files are saved into `public/images/`, named after the file you chose, lower
cased and hyphenated. **Uploading a photo with the same name replaces the
existing one.** Nothing is ever deleted — an image that stops being referenced
just stays on disk.

## Where the content lives

`src/data/content.json` and `src/data/posts.json` are the source of truth. The
site reads them through `src/data/content.js`, which only resolves image paths
against the base path the site is served from. Editing the JSON by hand is
fine; the editor writes the same shape.

Both files are in git, so `git diff` shows exactly what changed before a
deploy, and a bad edit is undone with `git checkout src/data`.

## Notes

- The editor binds to `127.0.0.1` and has no login. It is a local tool; do not
  expose it. Nothing about it ships in the built site.
- **Undo changes** reverts everything back to the last save. Once saved, use
  git.
- Closing the tab with unsaved changes prompts first.
