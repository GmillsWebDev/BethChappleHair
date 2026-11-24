# Beth Chapple Hair

Static website for Beth Chapple Hair, a hairdresser at Normingtons Salon, Petersfield: <https://bethchapplehair.co.uk>

Plain HTML, CSS and a little JavaScript, with no build step. Hosted on Eco Web Hosting. GitHub Actions deploys `release/**` to the test site and `main` to the live site (see `CLAUDE.md`).

## Preview locally

Pages use root-relative links (`./`), so open them through a local server rather than by double-clicking:

```
npx serve .
```

(or `python -m http.server`), then visit the address it prints.

## Where to look

- `CLAUDE.md`: how the site is put together and the conventions to follow when editing.
- `log.md`: open items (deployment checklist, things waiting on Beth) at the top, then a dated history of changes.
