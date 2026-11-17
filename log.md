# Log

## Open items

Living to-do list. Update it as things are done; the dated entries below are the history.

### Deployment checklist (next upload)
1. **Check the server's existing `.htaccess`** (cPanel File Manager → public_html, enable "show hidden files").
   - If one exists, **merge** ours into it rather than overwriting it. Keep anything cPanel/LiteSpeed added (e.g. PHP handler lines).
   - If it already has an HTTPS or www redirect, keep **only one** set of redirect rules, or you risk a redirect loop.
   - Many FTP clients hide dotfiles; make sure `.htaccess` actually uploads.
2. Merge feature branches into the release branch (currently `release/GeneralOnceover`), merge that into `main`, then upload all files (including the new `img/icons/sprite.svg`, `img/icons/instagram.svg`, `img/hba-awards-trophies.webp` and the renamed and new `img/gallery/*.webp`). Don't upload `img/galleryNew/` (originals inbox).
3. **Delete from the server** (uploading won't remove them): `docs/`, `gallery-scripts.js`, `gallery-styles.css`, `scripts/scripts.js`, `scripts/build.js`, `scripts/start.js`, `img/Archive/`, `img/px-conversions.zip`, the old `img/Logo-*-svg.svg` / `img/favicon-32x32.svg` files, the images deleted on 2026-11-16, and the old `img/gallery/Gallery*.webp` / `img/gallery/Bridal.webp`.
4. **Smoke test on the live site:**
   - `http://www.bethchapplehair.co.uk/index.html` should 301 to `https://bethchapplehair.co.uk/` in one hop.
   - `https://bethchapplehair.co.uk/img/gallery/Gallery2.webp` should 301 to `caramel-honey-balayage.webp`.
   - `https://bethchapplehair.co.uk/nope` should show the styled 404 page (with footer icons).
   - Cookie banner appears; Reject leaves no `_ga` cookies; Accept sets them; "Show map" loads the map.
   - Icons show in the footer, contact block and Instagram link; gallery lightbox arrows/close show and work; services tabs (desktop) and accordion (mobile) work.
5. If the CSS looks stale, browsers are caching the old file: bump `?v=` on `main.css` in all pages.

### After going live
- Submit `https://bethchapplehair.co.uk/sitemap.xml` in Google Search Console and request indexing of the home page.
- Test the home page in Google's Rich Results Test (HairSalon schema).
- Make sure the Google Business Profile name, address, phone and hours exactly match the site.
- Expect GA visitor numbers to drop (only consenting visitors are counted now).

### Waiting on Beth
- **2026 award wording** (draft on the home page, marked `DRAFT` in an HTML comment): "In 2026 I was proud to be placed 43rd in the UK for Hair Stylist of the Year."
- Services page intro copy per service (colour, balayage/highlights, grey blending, cut & finish, fine/curly hair, treatments). Mention Petersfield only where it reads naturally. Questions sent:
  1. Is the colour consultation free, and does it include the skin test?
  2. Beth's approach to fine and curly hair (dry cutting, a particular method, product advice?)
  3. Are grey blending and "lived-in" colour separate services or covered by existing prices?
  4. How much to say about gents' cuts and (paused) bridal?
- Possibly a short FAQ section (skin tests, deposits, parking at the Festival car park), which is also good for search.
- Reviews/testimonials she's happy to have quoted (then consider review schema).
- Old Fresha listings are still live: one with the wrong postcode (GU31 7JE) and one at 43 Chapel St, GU32 3DY with a different phone number. She no longer uses Fresha; ask them to remove both. (Beth has replied with a voice note; not yet gone through.)

- **Review link:** "Leave a review" points at a Google search for now. Replace it with Beth's own link from her Business Profile ("Ask for reviews", looks like `g.page/r/…/review`); marked `TODO` in `index.html`. Then consider a printed QR code for the salon.
- Update the review count ("from 26 Google reviews") when it changes, and swap in new reviews now and then.

### To review / decide
- Page titles and meta descriptions, gallery alt text, cookie policy rewrite, privacy policy edits.
- Saturday is left out of the schema opening hours (waitlist only). Confirm that's right.
- Whether to keep the commented-out Bridal tab (and `img/bridal2.webp`) or delete it.
- "Find me" and "Contact" in the nav both go to `#Contact`; consider merging them.

## History

Newest entries first.

## 2026-11-17 — SEO tidy-up (branch `feature/SEOcontentUpdate`)

### Structured data (`index.html`)
- JSON-LD is now an `@graph` with a `WebSite` entry (helps Google show "Beth Chapple Hair" as the site name) plus the `HairSalon`.
- Added `hasOfferCatalog`: every service and price from `services.html`, grouped as on the page. **Prices now live here too; keep them in sync.**
- `streetAddress` is now just "7-9 Heath Road" (salon name doesn't belong in that field). Added `hasMap` and `currenciesAccepted`.
- Left out `geo`: the map embed only gives the map's centre point, not the salon's exact position.

### Headings and copy
- Services H1 "Hair Services & Prices"; gallery H1 "Hair Gallery". Banner H1s scale down on narrow screens.
- Mobile accordion headers on the services page are now `h2`s (were `p`), styled to look the same.
- "Please note" is no longer an `h2` (`p.noteHeading`, same look).
- Home: "natural colour work" links to the services page; "get in touch" links to `#Contact`. Fixed "the Beautiful Normingtons Salon" capital.
- Footer contact details (all pages) and the "Visit me" block are wrapped in `<address>`.

### Images
- Gallery images renamed descriptively (e.g. `Gallery2.webp` → `caramel-honey-balayage.webp`). The old URLs 301 to the new ones in `.htaccess`.

### Font Awesome removed
- The kit script (render-blocking, whole icon library) is gone from all 7 pages. The 10 icons used are now in `img/icons/sprite.svg` (Font Awesome Free 6.5.2 SVGs, CC BY 4.0), used as `<svg class="icon"><use href="img/icons/sprite.svg?v=1#i-phone"></use></svg>`. The Instagram "Follow me" icon uses `img/icons/instagram.svg` as a CSS mask so the gradient hover still works.
- Contact block icons (home) were CSS `::before` using the FA font; now inline SVGs.
- Lightbox buttons in `gallery.js` use the sprite.
- `.htaccess`: SVG MIME type and 1-month caching.
- Cache busting: `main.css?v=3`, `gallery.js?v=2`.

### Checked
- Screenshots of home, gallery and services (desktop and mobile) in headless Chrome: icons match the originals, all images load, no visual changes apart from the new H1 text.

### Google profile and press
- Added her Google Business Profile share link (`https://share.google/cO5Qji3xQ9lu0HvOi`) to the schema `sameAs`.
- HBA section links to the Farnham Herald article about her being a finalist. The article calls it the "British Hairdressing Awards"; Beth confirms it was the Hair and Beauty Awards (HBA on the trophy), so the site wording stays as is.

### HBA awards section
- New photo of both trophies: `img/hba-awards-trophies.webp` (from the supplied `HBA_Awards.jpg`, resized to 1200x800 webp, 146 KB → 70 KB; JPG deleted).
- HBA content moved into its own row (`#Awards`): trophy photo left, text right on desktop; text then photo on mobile. The portrait of Beth with her certificate (`HBA24.webp`) stays with the "Quality Products / A Little About Me" block.
- Heading "HBA Finalist" → "HBA Awards".
- **DRAFT, needs Beth's OK:** added "In 2026 I was proud to be placed 43rd in the UK for Hair Stylist of the Year." (wording taken from the trophy; marked with an HTML comment). Schema `award` now lists both years.

### DeepSource fixes (PR #2)
- DeepSource JavaScript check failed on `var` usage ("use let or const", "var declarations at top of scope"). Converted `scripts/consent.js` and `scripts/gallery.js` to `let`/`const`, with reassigned state declared at the top of each script.
- Cache busting: `consent.js?v=2` (all pages), `gallery.js?v=3`.
- Tested in headless Chrome: lightbox opens, arrow keys move and wrap, Esc closes, arrow/close icons render; "Show map" loads the map and stores consent; banner Reject and the cookie settings form save correctly.
- DeepSource results can now be read with `gh` (GitHub CLI, signed in as the repo owner): inline comments via `gh api repos/GmillsWebDev/BethChappleHair/pulls/<n>/comments`. Issues outside a PR's diff only show on the DeepSource dashboard.

### Gallery rebuild: masonry + length filter
- 30 new photos (originals in `img/galleryNew/`, now git-ignored as an inbox) converted to webp in two sizes: `name.webp` (1000px wide, used by the lightbox) and `name-sm.webp` (500px wide, used in the grid). All metadata stripped (20 originals had GPS location). 96 MB of originals → 6.5 MB.
- New photo `blonde-pixie-long-fringe` replaces the old square crop `blonde-pixie-cut.webp` (deleted; the `Gallery15.webp` redirect now points to the new file).
- `gallery.html`: Bootstrap rows replaced by a `<ul class="masonry">` (CSS columns: 2 / 3 / 4 at <768 / 768+ / 1200+). New photos newest first, the 14 older square photos mixed in every third slot. First 8 load eagerly, the rest lazily.
- Each item carries `data-length` (`long` / `medium` / `short` / `up-do`), `data-colour` (`blonde` / `brunette` / `copper` / `vivid`, space-separated when two apply) and `data-texture` (`curly` / `not-curly`). Only length has a filter for now; colour and texture are there for later.
- Length filter buttons (`aria-pressed`) plus a live "Showing N … looks" count. Hidden unless JavaScript runs. The URL updates (`gallery.html?length=short`), so a filtered view can be linked to, e.g. from the services page.
- Lightbox steps only through the photos the current filter shows. Lightbox image now limited to the screen height so tall portrait photos fit.
- `main.css?v=4`, `gallery.js?v=4`.
- Tested in Chrome: all 44 images load; each filter shows the right count, pressed state and URL; lightbox inside the "short" filter cycles the 9 short looks and wraps; desktop and mobile screenshots checked.

### Reviews section (home page)
- New `#Reviews` section ("What my clients say") between the gallery preview and "Find me": 5.0 from 26 Google reviews (updated by hand), 7 review cards, "Leave a review" and "Read all reviews on Google" buttons.
- Reviews copied from Google (supplied in `reviews.md`): text exactly as written, names shortened to first name + initial, no dates (relative dates go stale).
- Layout (revised same day, the masonry version was too long): a scroll-snap carousel at every width, showing 1 card plus a peek on mobile, 2 on tablet and 3 on desktop, with cards in a row the same height. The rating and both buttons sit above the cards. ‹ › arrow buttons on tablet and up come from `scripts/reviews.js` (home page only); they dim at each end and use `aria-disabled` so keyboard focus isn't lost. No auto-rotation. Without JS the row still scrolls by touch or trackpad.
- No review schema: Google doesn't show stars for reviews a business shows on its own site.
- `main.css?v=6`, `reviews.js?v=1`.

### DeepSource fixes (PR #3)
- 22 minor findings (dashboard only, none inline): JS-0241 function-expression callbacks (18), JS-0246 string concatenation (2), JS-0118 strict mode inside the wrapper (2). Fixed in `gallery.js` and `reviews.js`, and the same patterns in `consent.js` (likely why PR #2 kept failing after the `var` fix).
- `window.gtag` deliberately left as a regular function (arrow functions have no `arguments`, which would silently stop GA recording); marked `// skipcq: JS-0241`.
- `consent.js?v=3`, `gallery.js?v=5`, `reviews.js?v=2`.
- Second DeepSource pass (13 findings, all `consent.js`, now in the diff): optional chaining (`consent?.maps`), `Boolean(x)` instead of `!!x`, `catch {}` without an unused `e`. The `arguments` push in `window.gtag` is marked `// skipcq: JS-0244` (rest parameters would give gtag.js a plain array, which it ignores). `consent.js?v=4`.
- Re-tested: GA consent flow, banner, map button, settings form, plus corrupt saved consent (banner shows, no error), saved consent (no banner, form pre-filled) and an outdated consent version (asked again).
- Re-tested in Chrome: GA loads only after Accept and `dataLayer` holds real Arguments objects; Reject deletes `_ga` cookies and leaves others; map consent, cookie form, lightbox, gallery filters and reviews carousel all pass. No JS errors.

## 2026-11-16 — Site overhaul (branch `site-overhaul`)

### Performance
- Logo: the old "SVG" logos were 1.1 MB PNGs in disguise, loaded 3x per page. Replaced with `img/logo.webp` (5 KB).
- Re-encoded the gallery images at the same size: about 3.4 MB down to about 480 KB in total. Banner backgrounds resized to 1920px; services tab images converted from PNG to webp.
- Merged the Google Fonts requests into one; removed unused fonts (Quicksand, Merienda, Quintessential, Abril Fatface).
- Removed jQuery, the duplicate Popper and the broken ekko-lightbox. Bootstrap JS is now `defer`.
- Hidden hero `<img>` is now lazy, so it no longer downloads. The hero background is preloaded on desktop.
- Images have `width`/`height` to stop the layout jumping as they load.
- `.htaccess`: gzip plus browser caching, with `?v=` cache busting on CSS/JS.

### Bugs fixed
- Broken `gallery.htm` link on the home page.
- Gallery page threw `jQuery is not defined` (ekko-lightbox loaded before jQuery).
- Lightbox sat underneath the sticky nav, hiding its close button. It's now on top, with keyboard support (arrows/Esc), focus handling and wrap-around in both directions (previous on the first image used to break).
- Pinch-zoom was disabled on most pages (`user-scalable=no`); it's now allowed.
- "Book now" / "Let's Chat" buttons were invalid HTML (a `<div>` inside an `<svg>`). Rebuilt as real links with the same animation, and the whole button is now clickable.
- Services tabs were `div`s; they're now `button`s, so keyboard users can reach them. Fixed the wrong `aria-labelledby`.
- The nav marked "Home" active on every page; now it marks the current page. The logo `<a>` sat directly in the `<ul>`; now it's wrapped in an `<li>`.
- `robots.txt` was invalid (it used a full URL in `Disallow`).

### SEO
- Unique titles and meta descriptions per page, canonical URLs, Open Graph / Twitter tags with a 1200x630 share image.
- `HairSalon` structured data (address, phone, hours Wed/Thu, booking action, socials, HBA 2024 finalist).
- `sitemap.xml`, plus a sitemap line in `robots.txt`.
- Alt text written for all gallery images; fixed the HBA photo's copy-pasted alt; decorative footer scissors now `alt=""`.
- Hidden captions on the price tables. `lang="en-GB"`.
- Favicon, apple-touch icon and web manifest.

### Cookie consent (UK GDPR / PECR)
- New banner with equally weighted "Reject optional" and "Accept all" buttons, plus a "Choose settings" link.
- Google Analytics only loads after opt-in. Opting out deletes the `_ga` cookies.
- The Google Map is click-to-load ("Show map") until maps consent is given.
- `cookies.html` rewritten: lists each cookie category and has on/off switches. "Cookie Settings" link added to every footer.
- `privacy.html`: updated the cookie section and removed the mention of a contact form that no longer exists; fixed the "cooky" typo.

### Cleanup
- Removed the `docs/` Sass boilerplate, `scripts/build.js`, `scripts/start.js`, `scripts/scripts.js` (dead carousel/form code), `gallery-scripts.js`, `gallery-styles.css`, `img/Archive/`, `img/px-conversions.zip`, the old logo SVGs, the commented-out PHP form and duplicate map, and about 400 lines of unused promo-tile/carousel CSS plus dead form CSS.
- Added `404.html`.

### Follow-up
- Live site served the same pages on http/https, www/non-www and /index.html with no redirects (duplicate content). Added 301 redirects in `.htaccess` to https://bethchapplehair.co.uk/.
- Deleted 20 unused images (old logos/banners, GalleryImg2_*, MFW) and the commented-out gallery banner block. Kept the commented Bridal tab + bridal2.webp for when bridal returns.

### Status
Merged into the release branch `release/GeneralOnceover` via PR #1. **Not live yet**; the live site still matches `main`.
