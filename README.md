# Amy Sindicic — Executive Coach & Career Strategist

Marketing site built with React + Vite.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run admin    # the site editor, with a live preview beside it
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Content

All copy lives in [`src/data/content.json`](src/data/content.json) and
[`src/data/posts.json`](src/data/posts.json) — services, audiences, the approach
steps, blog posts, the About text, the testimonials and the FAQs.
[`src/data/content.js`](src/data/content.js) only re-exports them and resolves
image paths against the base path.

Edit either through the site editor (`npm run admin`, see
[`tools/admin/README.md`](tools/admin/README.md)) or by hand — both write the
same shape.

Images live in [`public/images/`](public/images). Reviewer portraits go in
`public/images/testimonials/` and are wired up via the `photo` field on each
testimonial (an empty value falls back to an initials monogram).

## Deployment

```bash
bash scripts/deploy.sh "what changed"
```

That builds the site and publishes it to the `gh-pages` branch of the `parix`
remote, live at <https://parix-ai.github.io/amy-site/>.

The branch also carries files this project does not build — Amy's PDFs under
`assets/docs`, and `assets/img` and `assets/brand` from the previous site — so
the script copies the build *over* the branch rather than replacing it, and
prunes only superseded bundles. It refuses to publish if the built `index.html`
does not carry the expected base path.

GitHub Pages serves project sites from `/<repo>/`, so
[`vite.config.js`](vite.config.js) derives `base` from `GITHUB_REPOSITORY` at
build time — the same code works in any repository. Locally it builds at `/`.
For a custom domain, build with `VITE_BASE=/`.

## Outstanding

- Blog article bodies, Privacy Policy and Terms of Service are placeholders —
  they render a visible "to be supplied by client" panel.
- Contact email and LinkedIn URL are blank in `site` (`src/data/content.js`);
  the footer icons fall back to the booking page until they are filled in.
- The hero photograph is a low-resolution crop; replace
  `public/images/amy-hero.jpg` with the original when available.
