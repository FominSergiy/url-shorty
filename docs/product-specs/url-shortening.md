# Product Spec: URL Shortening

**Status**: Implemented  
**GitHub issue**: N/A (initial scaffold)

## Goal

Users can paste a long URL and get a short link they can copy and share.
Clicking the short link redirects to the original URL and increments a click counter.

## User stories

1. **Shorten**: I paste a URL into the input and click Shorten. I receive a short URL.
2. **Redirect**: I visit the short URL and am redirected to the original page.
3. **Copy**: I click Copy next to the short URL. The link is in my clipboard.
4. **Stats**: I can query the short code to see how many times it was clicked.

## Acceptance criteria

- [ ] `POST /api/v1/shorten` with `{ url: "https://..." }` returns `{ code, shortUrl }`
- [ ] `GET /:code` redirects (302) to the original URL
- [ ] `GET /:code` increments the click counter
- [ ] `GET /api/v1/stats/:code` returns `{ code, originalUrl, clicks, createdAt }`
- [ ] Invalid/missing URL returns 400 with `{ error: "url is required" }`
- [ ] Unknown code returns 404

## Out of scope (v1)

- Custom short codes
- Expiring links
- User accounts
- Bulk shortening
