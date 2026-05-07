# Tech Debt Tracker

| Item | Severity | Added | Notes |
|---|---|---|---|
| No input URL validation (format/scheme check) | High | 2026-05-07 | Accept only http/https, reject javascript: data: etc |
| No rate limiting on POST /api/v1/shorten | Medium | 2026-05-07 | Add express-rate-limit before prod |
| Inline styles in React components | Low | 2026-05-07 | Move to CSS modules or a stylesheet using design tokens |
| No CORS config | Medium | 2026-05-07 | Add cors middleware restricted to frontend origin |
| No npm audit in CI | Medium | 2026-05-07 | Add to GitHub Actions workflow |
