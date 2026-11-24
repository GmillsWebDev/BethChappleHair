# CLAUDE.md

Static marketing site for **Beth Chapple Hair**, a self-employed hairdresser in Petersfield, Hampshire (works from Normingtons Salon, 7-9 Heath Rd, GU31 4JE). Live domain: `https://bethchapplehair.co.uk`.

## Hosting
- **Eco Web Hosting** (Apache / cPanel). Files are uploaded as-is; there is no build step.
- `.htaccess` sets the 404 page, gzip and browser caching. If the server already has an `.htaccess` (e.g. an HTTPS redirect added by cPanel), **merge** rather than overwrite.

## Stack
- Plain HTML pages at repo root, no package.json. Edit files directly.
- Bootstrap 5.2.3 (CDN CSS + bundle JS, `defer`), Google Fonts (Nanum Gothic Coding for body, Ysabeau Office for headings, in one request). **No jQuery, no Font Awesome.** Icons are inline SVGs from `img/icons/sprite.svg` (`<svg class="icon" aria-hidden="true" focusable="false"><use href="img/icons/sprite.svg?v=1#i-NAME"></use></svg>`; `/img/...` in 404.html). Add new icons as `<symbol>`s there.
- Bookings go to Timely: `https://bookings.gettimely.com/bethchapplehair/book`. No on-site contact form.
- Google Analytics `G-V801EGG6QR` is loaded **only after cookie consent**, by `scripts/consent.js`. Never add a raw gtag snippet to a page.

## Layout
| Path | Purpose |
|---|---|
| `index.html` | Home: hero, About, HBA awards (`#Awards`), gallery preview, reviews carousel (`#Reviews`, arrows via `scripts/reviews.js`), Find me / contact, click-to-load map, JSON-LD (`WebSite` + `HairSalon`) |
| `services.html` | Price list (Bootstrap tabs on desktop, accordion on mobile) |
| `gallery.html` | Masonry gallery (`ul.masonry`, CSS columns) with length filter + lightbox (`scripts/gallery.js`). See "Adding gallery photos" below |
| `policies.html`, `privacy.html`, `cookies.html` | Legal pages. `cookies.html#cookie-settings` holds the consent toggles |
| `404.html` | Error page. Uses **root-absolute** paths (`/sass/main.css`) because it's served at any URL |
| `sass/main.css` | **The** stylesheet. Plain CSS (no SCSS source exists), edit directly |
| `scripts/consent.js` | Cookie banner, consent storage (`localStorage` key `bch-consent`), GA loader, map gating, settings form |
| `scripts/reviews.js` | Reviews carousel arrow buttons (home page only). Reviews are hand-copied from Google: text verbatim, first name + initial |
| `scripts/gallery.js` | Lightbox (keyboard: arrows / Esc) |
| `sitemap.xml`, `robots.txt`, `site.webmanifest`, `.htaccess` | SEO / hosting config |
| `img/` | Images (webp). `img/logo.webp` (200x146, shown at 100px) is the site logo; `img/logo.png` is used in schema. `img/icons/` = touch/manifest icons plus `sprite.svg` (UI icons). Gallery images are in `img/gallery/`. `img/og-image.jpg` = social share image |

## Conventions
- Head, nav and footer are copy-pasted into every page (7 files incl. 404). Any change must be repeated in all of them. Nav "active" state is per page.
- Home links use `./` and `./#Contact` (not `index.html`) so they match the canonical URL `/`. Because of this, preview through a local server (`npx serve .`), not by double-clicking files.
- **Cache busting:** CSS/JS are cached for a month by `.htaccess`. When you change `main.css`, bump `?v=N` in every page; same for `consent.js` / `gallery.js`.
- Business facts (prices, hours, phone, address) appear in several places: footers, the home page contact section (hours, phone, address), the JSON-LD in `index.html` (including every price in `hasOfferCatalog`), services tables. Keep them in sync.
- If consent categories change, bump `CONSENT_VERSION` in `consent.js` and update `cookies.html`.
- When pages are added or removed, update `sitemap.xml`.
- Images: `.webp` (convert with Pillow: `python -m pip install --user pillow`; no other image tools on this machine), descriptive kebab-case file names, meaningful `alt` (decorative = `alt=""`), `width`/`height` attributes, `loading="lazy"` below the fold. External links: `target="_blank" rel="noopener"`.
- **JavaScript style (DeepSource checks every PR):** `'use strict';` at the top of the file (not inside the wrapper), `const`/`let` never `var`, arrow functions for callbacks, template literals instead of `+` concatenation with variables, optional chaining (`a?.b`) instead of `a && a.b`, `Boolean(x)` instead of `!!x`, `catch {` when the error isn't used. Exception: `window.gtag` in `consent.js` must stay a regular `function` pushing the real `arguments` object (gtag.js ignores plain arrays); it carries `// skipcq: JS-0241` and `// skipcq: JS-0244`. Read PR findings with `gh api repos/GmillsWebDev/BethChappleHair/pulls/<n>/comments`; issues outside the diff only show on the DeepSource dashboard.
- British English in copy ("colour", "specialise"). Site copy is first person (Beth).

## Deployment (GitHub Actions → Eco Web Hosting)
- `.github/workflows/deploy.yml` deploys over SSH with rsync. Push to `main` → **production** (`~/domains/bethchapplehair.co.uk/public_html`; `~/public_html` is a symlink to it, `https://bethchapplehair.co.uk`, needs a manual approval). Push to `release/**` → **test** (`~/domains/test.bethchapplehair.co.uk/public_html`, `https://test.bethchapplehair.co.uk`). Day to day: `feature/*` → PR into `release/*` → check on test → PR into `main`.
- rsync `--delete` makes the server match the repo: delete a file from the repo and it goes from the server. Protected (never deleted): `.well-known/`, `cgi-bin/`, `error_log`, `.user.ini`, `php.ini`, `.htpasswd`, `.ftpquota`.
- Never uploaded: `.git*`, `.github/`, `*.md`, `img/galleryNew/`.
- Test deploys only: `robots.txt` becomes disallow-all, and `.htaccess` gets `X-Robots-Tag: noindex` plus basic-auth lines (`TEST_HTPASSWD_PATH` secret). The server is **LiteSpeed**; SSL is a wildcard certificate (`*.bethchapplehair.co.uk`), so subdomains need no AutoSSL. GA only loads on `bethchapplehair.co.uk` (`LIVE_HOST` in `consent.js`), so test and local previews aren't counted.
- Login details are GitHub **environment** secrets (`production`, `test`): `DEPLOY_HOST`, `DEPLOY_PORT`, `DEPLOY_USER`, `DEPLOY_PATH`, `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`. The workflow refuses any `DEPLOY_PATH` other than `/home/<user>/domains/<that target's domain>/public_html/`.
- "Run workflow" in the Actions tab defaults to a **dry run** (lists uploads/deletes only). Untick it to deploy for real.
- Rollback: revert the commit on `main` (it redeploys), or re-run an earlier successful run.
- Server-side `.htaccess` edits are overwritten on every deploy; put them in the repo's `.htaccess`.

## Adding gallery photos
- Originals go in `img/galleryNew/` (git-ignored inbox; never uploaded). Convert with Pillow, applying EXIF orientation and **not** copying metadata (phone photos carry GPS): `name.webp` at 1000px wide (q80) for the lightbox and `name-sm.webp` at 500px wide (q76) for the grid, both in `img/gallery/`.
- Add an `<li class="masonry__item">` to `gallery.html`: `<a class="galleryItem" href="…/name.webp">` wrapping `<img src="…/name-sm.webp">` with real `width`/`height` and alt text, plus the `.img-overlay` span. Copy an existing item.
- Tag every item: `data-length` = `long` | `medium` | `short` | `up-do`; `data-colour` = any of `blonde` `brunette` `copper` `vivid` (space-separated); `data-texture` = `curly` | `not-curly`. A new filter value needs a button in `.galleryFilters` and an entry in `labels` in `gallery.js`.

## Working rules
- Log each session's changes in `log.md` under History (newest first), and keep its **Open items** section (deployment checklist, waiting on Beth, decisions) up to date.
- Don't change business facts or policy wording unless asked.
