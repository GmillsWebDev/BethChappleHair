# Log

## Open items

Living to-do list. Update it as things are done; the dated entries below are the history.

**In progress: CI/CD** (GitHub Actions → Eco Web Hosting over SSH/rsync: `main` → live, `release/**` → test.bethchapplehair.co.uk). Workflow, server keys, test password, environments, secrets and branch protection are done. Eco confirmed the firewall allows GitHub's runners, and the host key fingerprint is verified. **Paused 2026-11-24; next (planned 2026-11-25):** commit and push `log.md`, then PR and merge `feature/CiCdPipeline` into `release/GeneralOnceover`, which starts a real test deploy. Step-by-step notes in `CICD_plan.md` (git-ignored, local only).

### Deployment checklist (first live deploy)
1. Download a backup of the live folder.
2. Finish the server account checks (see `CICD_plan.md`) and check `index.php` and `test/` in the live folder: they aren't in the repo, so the deploy deletes them, along with the other old leftovers.
3. Test site checked, then PR `release/GeneralOnceover` into `main`. The merge queues a live deploy that waits for approval, and "Run workflow" (dry run) becomes available. Manual runs use the same approval and queue, so to see a dry run first, reject the queued deploy, dry-run `main`, then re-run the deploy.
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
- Is Wet Curl Finish (£10) an add-on or bookable on its own? Is the consultation free for everyone, and only for colour?
- Possibly a short FAQ section (skin tests, deposits, parking at the Festival car park), which is also good for search.
- Reviews/testimonials she's happy to have quoted (then consider review schema).
- Old Fresha listings are still live: one with the wrong postcode (GU31 7JE) and one at 43 Chapel St, GU32 3DY with a different phone number. She no longer uses Fresha; ask them to remove both. (Beth has replied with a voice note; not yet gone through.)

- **Review link:** "Leave a review" points at a Google search for now. Replace it with Beth's own link from her Business Profile ("Ask for reviews", looks like `g.page/r/…/review`); marked `TODO` in `index.html`. Then consider a printed QR code for the salon.
- Update the review count ("from 26 Google reviews") when it changes, and swap in new reviews now and then.

### To review / decide
- Page titles and meta descriptions, gallery alt text, cookie policy rewrite, privacy policy edits.
- Saturday is left out of the schema opening hours (waitlist only). Confirm that's right.
- Whether to keep the commented-out Bridal tab (and `img/bridal2.webp`) or delete it.

## History

Newest entries first.

## 2026-11-24 — Server checks before the first deploy
- Eco support: single key-authenticated SSH connections from GitHub's runners are allowed; repeated failed logins can trigger a temporary block.
- Host key fingerprint checked from cPanel Terminal on the server: it matches the expected value.
- Nothing deployed yet. The test merge is planned for 2026-11-25.

## 2026-11-24 — Docs check
- `CLAUDE.md`, `README.md` and the open items above brought up to date with the pipeline, contact section, buttons and home gallery.

## 2026-11-24 — Home gallery preview (branch `feature/CiCdPipeline`)
- Swapped the caramel balayage and golden blonde waves (looks the full gallery has plenty of) for the short natural curls and the blonde pixie. Swapped the brunette chignon for the lilac undercut (three up-dos was a lot). Portrait photos are cropped to squares in CSS. Still `main.css?v=7` (not deployed yet).

## 2026-11-24 — Curly services (branch `feature/CiCdPipeline`)
- Services page, Cut & Finish: existing prices now under "General", new "Curly" group (curly cut and finish short £68, medium £78, long £88; wet curl finish £10), names and prices from Timely. Also added to the JSON-LD. "Curly" sits above "General".
- Added from Timely: In-between Colour £42.50, Custom Colour (varies), Colour Consultation (free, as already stated on the home page; Timely lists it as "Consultation" under "Comp" with no price), K18 Molecular Repair £25. JSON-LD updated.
- "Let's Chat!" button left-aligned.

## 2026-11-24 — Contact section redesign (branch `feature/CiCdPipeline`)
- Home `#Contact` rebuilt: gradient-framed "Book an appointment" panel (Book online, phone, email, opening hours) beside "Find me" (address, new Get directions link, map). Stacks on mobile and tablet.
- The map stays click-to-load; the placeholder is smaller and no longer grey. "Open in Google Maps" replaced by Get directions.
- Opening hours now also appear here; keep in sync with the footers and JSON-LD. `main.css?v=7`.
- Buttons unified as `.siteBtn` (white with a purple frame, main action) and `.siteBtn--secondary` (soft purple fill, dark text), same height, with a 0.3rem radius. Replaces `drawBtn` (hero, services, 404) and `reviewBtn`; the animated outline is gone. Gallery filters squared to match. Cookie and map buttons unchanged.
- Nav "Find me" (all pages) now goes to `#FindMe`; "Contact" still goes to `#Contact`. Both clear the sticky nav.
- Footer email wraps instead of overflowing at about 768px.

## 2026-11-24 — CI/CD server paths (branch `feature/CiCdPipeline`)
- Found the real folders: each domain has `~/domains/<domain>/public_html`. `~/public_html` is a symlink to the live one. The test folder is separate and holds only `cgi-bin/` and the placeholder page.
- `deploy.yml`: the path check now accepts only the target's own domain folder (the old check refused any test path containing `public_html`).
- Test site password file created outside the web folders; `DEPLOY_PATH` (both) and `TEST_HTPASSWD_PATH` secrets set.
- Both deploy public keys are in the server's `authorized_keys`.
- Correction to 2026-11-21: there's no `.htpasswd` in the live `public_html`; `.htpasswd/` is a folder one level up.
- The live `public_html` has `index.php` (September 2025) and `test/` (February 2026), which aren't in the repo and would be deleted by the first live deploy. Check them first.

## 2026-11-21 — CI/CD pipeline (branch `feature/CiCdPipeline`)
- Decisions: SSH is available, so deploys use **rsync** (mirrors the repo, deletes leftovers). Test site password-protected. DeepSource must pass before merging to `main`, and live deploys need a manual approval.
- New `.github/workflows/deploy.yml`: `main` → production, `release/**` → test. Stages only site files, makes test-only changes (disallow-all robots, `X-Robots-Tag: noindex`, basic auth with `/.well-known/` left open for AutoSSL), checks `DEPLOY_PATH` before an rsync `--delete`, protects server-managed files, queues deploys per target, writes a summary to the run page. Manual runs default to dry run. `actions/checkout` pinned to the v7.0.1 SHA.
- `.htaccess`: the http/www → https redirect now keeps the requested host (so test stays on test); the live behaviour is unchanged.
- `consent.js`: GA loads only on `bethchapplehair.co.uk`. Now `consent.js?v=5` on all pages.
- `CLAUDE.md`: new Deployment section.
- Server checks: there's **no `.htaccess` on the server** (nothing to merge), so the first live deploy also switches on the http → https and www redirects, gzip and caching. The live site currently serves plain http with a 200. The server is LiteSpeed. There's a `.htpasswd` in `public_html`, which the server blocks (403) and the deploy never touches. SSL is a wildcard certificate, and `test.` exists (cPanel placeholder page). Test basic auth simplified to plain `Require valid-user`.
- GitHub: created the `production` (`main` only) and `test` (`release/**`) environments and set their SSH secrets. The free plan refuses required reviewers and branch protection on a private repo, so the repo was **made public**. `production` now needs an approval, and `main` requires a PR plus both DeepSource checks.

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
