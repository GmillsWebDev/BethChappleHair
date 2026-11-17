# Log

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

### Deployment additions
- Upload `img/icons/sprite.svg` and `img/icons/instagram.svg`.
- Delete the old `img/gallery/Gallery*.webp` and `img/gallery/Bridal.webp` from the server (the redirects work either way).

### Still needs Beth
- Answers to the services-copy questions (below), reviews/testimonials she's happy to quote, her Google Business Profile URL.

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
All work is on branch `site-overhaul` (committed, **not pushed, not live**). `main` still matches the live site.

## Next steps

### Before going live (deployment checklist)
1. **Check the server's existing `.htaccess`** (cPanel File Manager → public_html, enable "show hidden files").
   - If one exists, **merge** ours into it rather than overwriting it. Keep anything cPanel/LiteSpeed added (e.g. PHP handler lines).
   - If it already has an HTTPS or www redirect, keep **only one** set of redirect rules, or you risk a redirect loop.
   - Many FTP clients hide dotfiles; make sure `.htaccess` actually uploads.
2. Merge `site-overhaul` into `main` and upload all files.
3. **Delete from the server** (uploading won't remove them): `docs/`, `gallery-scripts.js`, `gallery-styles.css`, `scripts/scripts.js`, `scripts/build.js`, `scripts/start.js`, `img/Archive/`, `img/px-conversions.zip`, the old `img/Logo-*-svg.svg` / `img/favicon-32x32.svg` files, and the other images deleted in this session.
4. **Smoke test on the live site:**
   - `http://www.bethchapplehair.co.uk/index.html` should 301 to `https://bethchapplehair.co.uk/` in one hop.
   - `https://bethchapplehair.co.uk/nope` should show the styled 404 page.
   - Cookie banner appears; Reject leaves no `_ga` cookies; Accept sets them; "Show map" loads the map.
   - Gallery lightbox, services tabs (desktop) and accordion (mobile) work.
5. If the CSS looks stale, browsers are caching the old file: bump `?v=` on `main.css` in all pages.

### After going live
- Submit `https://bethchapplehair.co.uk/sitemap.xml` in Google Search Console and request indexing of the home page.
- Test the home page in Google's Rich Results Test (HairSalon schema).
- Make sure the Google Business Profile name, address, phone and hours exactly match the site.
- Expect GA visitor numbers to drop (only consenting visitors are counted now).

### For Beth / Gary to review
- Page titles and meta descriptions, gallery alt text, cookie policy rewrite, privacy policy edits.
- Saturday is left out of the schema opening hours (waitlist only). Confirm that's right.
- Whether to keep the commented-out Bridal tab (and `img/bridal2.webp`) or delete it.
- "Find me" and "Contact" in the nav both go to `#Contact`; consider merging them.

### Content work (next session)
- Services page intro copy per service (colour, balayage/highlights, grey blending, cut & finish, fine/curly hair, treatments), mentioning Petersfield. Open questions:
  1. Is the colour consultation free, and does it include the skin test?
  2. Beth's approach to fine and curly hair (dry cutting, a particular method, product advice?)
  3. Are grey blending and "lived-in" colour separate services or covered by existing prices?
  4. How much to say about gents' cuts and (paused) bridal?
- Possibly a short FAQ section (skin tests, deposits, parking at the Festival car park), which is also good for search.
