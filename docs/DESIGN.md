# Design System

> Agents working on any UI: read this file before touching `.jsx` or `.css`. Use only the tokens defined here — do not invent new values.

## Design tokens

### Colors

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#ffffff` | Page background |
| `--color-surface` | `#f8f8f8` | Cards, inputs |
| `--color-border` | `#e0e0e0` | Borders, dividers |
| `--color-text` | `#1a1a1a` | Primary text |
| `--color-text-muted` | `#6b7280` | Secondary text, placeholders |
| `--color-accent` | `#2563eb` | Buttons, links, focus rings |
| `--color-accent-hover` | `#1d4ed8` | Button hover |
| `--color-error` | `#dc2626` | Error messages |
| `--color-success` | `#16a34a` | Success states |

### Typography

| Token | Value |
|---|---|
| `--font-family` | `system-ui, -apple-system, sans-serif` |
| `--font-size-sm` | `14px` |
| `--font-size-base` | `16px` |
| `--font-size-lg` | `20px` |
| `--font-size-xl` | `28px` |

### Spacing (8px grid)

`4px · 8px · 12px · 16px · 24px · 32px · 48px · 64px`

### Border radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `4px` | Inputs |
| `--radius-md` | `8px` | Cards, buttons |
| `--radius-lg` | `12px` | Modals |

---

## Components

### Button
```jsx
<button className="btn btn-primary">Shorten</button>   // accent fill
<button className="btn btn-secondary">Copy</button>     // outlined
```
States: default → hover (darken) → disabled (opacity 0.5, cursor not-allowed).

### Input
```jsx
<input className="input" type="url" />
```
Focus: `2px solid var(--color-accent)`, offset `2px`.

### Card
```jsx
<div className="card">...</div>
```
Surface background, border, `--radius-md`, padding `16px`.

---

## Page layout

Max content width: `560px`, centered, `margin: 0 auto`, page padding `16px`.

---

## Mockups

ASCII mockups are the canonical layout reference for agents.
PNG baselines live in `docs/design-docs/mocks/` for Playwright visual regression.

### Main page — initial

```
┌─────────────────────────────────────────┐
│  url-shorty                             │
│                                         │
│  ┌──────────────────────────┐ ┌───────┐ │
│  │ https://...              │ │Shorten│ │
│  └──────────────────────────┘ └───────┘ │
└─────────────────────────────────────────┘
```

### Main page — result

```
┌─────────────────────────────────────────┐
│  url-shorty                             │
│                                         │
│  ┌──────────────────────────┐ ┌───────┐ │
│  │ https://example.com/long │ │Shorten│ │
│  └──────────────────────────┘ └───────┘ │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ Short URL:                          ││
│  │ http://localhost:3001/aB3dEfG [Copy]││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Error state

```
│  ┌──────────────────────────┐ ┌───────┐ │
│  │                          │ │Shorten│ │
│  └──────────────────────────┘ └───────┘ │
│  ✕ url is required                       │
```

---

## Asset locations

| Format | Location | Purpose |
|---|---|---|
| ASCII art | This file | Agent layout reference |
| PNG baseline | `docs/design-docs/mocks/<feature>.png` | Playwright visual regression |
| SVG wireframe | `docs/design-docs/mocks/<feature>.svg` | Precise specs |
| Figma | Link below | Designer hi-fi mocks |

**Figma**: _not yet linked — add URL here when available_
