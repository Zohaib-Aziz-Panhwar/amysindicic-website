# Amy Sindicic — React site (Vite + React 19 + React Router + Framer Motion)

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production build → dist/
    npm run preview    # preview the build

## Deploy
`npm run build` and upload `dist/` to Netlify / Vercel / any static host.
It's a single-page app: configure the host to serve `index.html` for all routes
(Netlify: add `public/_redirects` with `/* /index.html 200`; Vercel does this automatically).

## Structure
- `src/data.js` — all content that changes often: packages, testimonials, case studies, posts, resource library, hero translation examples.
- `src/components/Hero.jsx` — constellation canvas, flipping headline, live translator, parallax.
- `src/components/Sections.jsx` — every home-page section (also reused on inner pages).
- `src/components/Nav.jsx`, `Footer.jsx` — nav + scroll progress; newsletter, CTA, footer, slide-in offer, sticky mobile CTA.
- `src/components/ui.jsx` — Reveal (scroll animation), SectionHead, PageHero, VideoModal context, CountUp.
- `src/pages/*` — Home, Services, About, CaseStudies, Resources, Blog, Contact.
- `src/styles.css` — brand tokens at the top; all styling.
- `public/assets/` — brand images, photos, downloadable PDFs/DOCX.

## Before launch
- Replace `public/assets/img/amy-portrait.jpg` with a professional headshot.
- Contact form and newsletter currently open a pre-filled email; swap in Calendly / Mailchimp when Amy provides links (`Contact.jsx`, `Footer.jsx`).
