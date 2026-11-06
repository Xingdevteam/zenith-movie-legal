# Zenith Movie Legal Center

Static legal site for Zenith Movie ("Beyond Every Screen"). HTML5, CSS3 and vanilla JS only. No build step, no dependencies.

Live URL: https://xingdevteam.github.io/zenith-movie-legal/

## Deploy (GitHub Pages)
1. Create the repo `xingdevteam/zenith-movie-legal` and push these files to the root of `main`.
2. Settings > Pages > Deploy from a branch > `main` / `(root)`.
3. All links are relative (404.html uses `/zenith-movie-legal/`), so the site works under the project path.

## Before publishing
- Search every page for `class="ph"`: each amber `[Placeholder: ...]` or `[Confirm: ...]` must be replaced or removed.
- Delete the "Draft for owner review" notices (`note--draft`) once done.
- Add the official TMDB logo (tmdb-attribution.html, section 03). Download it from TMDB's logos and attribution page and do not modify it.
- Have a qualified lawyer review the Privacy Policy and Terms.

## Files
- `index.html`, `privacy-policy.html`, `terms-of-service.html`, `tmdb-attribution.html`, `contact.html`, `404.html`
- `assets/css/styles.css`, `assets/js/main.js`, `assets/img/*`
- `robots.txt`, `sitemap.xml`, `.nojekyll`

Header, footer and nav are repeated in each HTML file (no JS injection, so pages work without JavaScript). If you change them, update every page.

## Local preview
`python3 -m http.server` then open http://localhost:8000/
