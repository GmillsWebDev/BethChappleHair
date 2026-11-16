# Log

Newest entries first.

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

### Not done / needs input
- See the session summary: merge `.htaccess` with any existing server copy; new copy for the services page.
