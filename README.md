# Amy Sindicic — Executive Career Strategist & Coach

Marketing site built with React + Vite.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Content

All copy lives in [`src/data/content.js`](src/data/content.js) — services,
audiences, the approach steps, blog posts, the About text and the testimonials.
Editing that one file updates every page; no component changes needed.

Images live in [`public/images/`](public/images). Reviewer portraits go in
`public/images/testimonials/` and are wired up via the `photo` field on each
testimonial (an empty value falls back to an initials monogram).

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes it to GitHub Pages.

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
