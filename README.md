# Amy Sindicic — Transformations 123 website

Static site, no build tools required. Open `index.html` in a browser or upload the whole folder to any host (Netlify, Vercel, cPanel/WordPress hosting `public_html`, GitHub Pages).

## Pages
index · services · about · case-studies · resources · blog · contact

## Editing
- Page content lives in `_src/*.body.html`; shared nav in `_src/header.html`, CTA + footer in `_src/footer.html`.
- After editing anything in `_src/`, run `./build.sh` to regenerate the `*.html` pages.
- Styles: `css/styles.css` (brand tokens at the top). Behaviour: `js/main.js`.
- Assets scraped from transformations123.com are in `assets/` (brand, images, downloadable PDFs/DOCX).

## To do before launch
- Replace `assets/img/amy-portrait.jpg` (cropped from a video still) with a professional headshot.
- Contact form currently opens a pre-filled email; swap the `<form>` action for Formspree/Netlify Forms or a Calendly embed if preferred.
- Blog cards link to the existing WordPress posts; migrate posts here if the old site is retired.
