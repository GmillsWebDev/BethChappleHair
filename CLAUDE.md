# CLAUDE.md

Static marketing site for **Beth Chapple Hair**, a self-employed hairdresser in Petersfield, Hampshire (works from Normingtons Salon, 7-9 Heath Rd, GU31 4JE). Live domain: `https://bethchapplehair.co.uk`.

## Hosting
- **Eco Web Hosting** (Apache / cPanel). Files are uploaded as-is; there is no build step.
- `.htaccess` sets the 404 page, gzip and browser caching. If the server already has an `.htaccess` (e.g. an HTTPS redirect added by cPanel), **merge** rather than overwrite.

## Stack
- Plain HTML pages at repo root, no package.json. Edit files directly.
- Bootstrap 5.2.3 (CDN CSS + bundle JS, `defer`), Font Awesome kit, Google Fonts (Nanum Gothic Coding for body, Ysabeau Office for headings, in one request). **No jQuery.**
- Bookings go to Timely: `https://bookings.gettimely.com/bethchapplehair/book`. No on-site contact form.
- Google Analytics `G-V801EGG6QR` is loaded **only after cookie consent**, by `scripts/consent.js`. Never add a raw gtag snippet to a page.

## Layout
| Path | Purpose |
|---|---|
| `index.html` | Home: hero, About, gallery preview, Find me / contact, click-to-load map, `HairSalon` JSON-LD |
| `services.html` | Price list (Bootstrap tabs on desktop, accordion on mobile) |
| `gallery.html` | Image grid + lightbox (`scripts/gallery.js`) |
| `policies.html`, `privacy.html`, `cookies.html` | Legal pages. `cookies.html#cookie-settings` holds the consent toggles |
| `404.html` | Error page. Uses **root-absolute** paths (`/sass/main.css`) because it's served at any URL |
| `sass/main.css` | **The** stylesheet. Plain CSS (no SCSS source exists), edit directly |
| `scripts/consent.js` | Cookie banner, consent storage (`localStorage` key `bch-consent`), GA loader, map gating, settings form |
| `scripts/gallery.js` | Lightbox (keyboard: arrows / Esc) |
| `sitemap.xml`, `robots.txt`, `site.webmanifest`, `.htaccess` | SEO / hosting config |
| `img/` | Images (webp). `img/logo.webp` (200x146, shown at 100px) is the site logo; `img/logo.png` is used in schema. `img/icons/` = touch/manifest icons. `img/og-image.jpg` = social share image |

## Conventions
- Head, nav and footer are copy-pasted into every page (7 files incl. 404). Any change must be repeated in all of them. Nav "active" state is per page.
- Home links use `./` and `./#Contact` (not `index.html`) so they match the canonical URL `/`. Because of this, preview through a local server (`npx serve .`), not by double-clicking files.
- **Cache busting:** CSS/JS are cached for a month by `.htaccess`. When you change `main.css`, bump `?v=N` in every page; same for `consent.js` / `gallery.js`.
- Business facts (prices, hours, phone, address) appear in several places: footers, the JSON-LD in `index.html`, services tables. Keep them in sync.
- If consent categories change, bump `CONSENT_VERSION` in `consent.js` and update `cookies.html`.
- When pages are added or removed, update `sitemap.xml`.
- Images: `.webp`, meaningful `alt` (decorative = `alt=""`), `width`/`height` attributes, `loading="lazy"` below the fold. External links: `target="_blank" rel="noopener"`.
- British English in copy ("colour", "specialise"). Site copy is first person (Beth).

## Working rules
- Log each session's changes in `log.md` (newest at top).
- Don't change business facts or policy wording unless asked.
