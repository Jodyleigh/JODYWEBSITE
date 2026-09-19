# Lumière Beauty — Makeup Store

**Module:** WEDE5020 — Web Development (Introduction) · **Assessment:** Part 2 · The IIE
**Student name / number:** [add here]
**Live site:** [add GitHub Pages / hosting link] · **Repository:** [add GitHub link]

## Overview
Lumière Beauty is a multi-page, front-end makeup store prototype. It has a product catalogue with category filters, product detail pages, deals, a shopping bag, checkout, sign-in / sign-up, and About and Contact pages. The design is responsive from desktop down to small phones and supports light and dark mode.

## Pages
| Page | Purpose |
|---|---|
| `index.html` | Home: hero, categories, bestsellers, looks gallery, reviews |
| `products.html` | Full catalogue with category filters (`?cat=Lips` also works) |
| `product-details.html` | Single product view (`?id=0` … `?id=15`) |
| `deals.html` | Bundles with discount code `LUMIERE10` |
| `cart.html` | Bag with quantity controls and delivery rules |
| `checkout.html` | Delivery and payment form with live order summary |
| `login.html` | Sign in / sign up tabs |
| `about.html`, `contact.html` | Brand story and contact form |

## Project structure
```
site/
├── index.html … contact.html   9 pages, each linked to style.css
├── style.css                   external stylesheet (all styling)
├── app.js                      product data, cart, filters, forms, mobile menu
├── images/                     79 product and editorial photos
└── README.md
```

## How to run
Open `index.html` in any browser, or serve the folder with a local web server (e.g. `npx serve site`).

## CSS approach (desktop)
`style.css` is the single external stylesheet, linked in the `<head>` of every page. It is organised into commented sections:

1. **Default styles** — colour tokens (CSS variables), light/dark themes, box-sizing reset, base `html`, `body`, headings, lists, form controls, `img`.
2. **Layout structure** — `.container`, sticky header, CSS Grid and Flexbox layouts for grids, detail, cart and split sections.
3. **Components** — typography (Cormorant Garamond headings, Jost body), colours and decoration for cards, buttons, chips, forms, deals and reviews.
4. **Interaction** — pseudo-classes and pseudo-elements: `:hover`, `:focus`, `:focus-visible`, `:active`, `:disabled`, `:invalid`, `:not()`, `:first-of-type`, `:nth-child()`, `:last-child`, `::before`, `::after`, `::selection`, plus the attribute selector `[aria-current="page"]` for the active page link.
5. **Utilities** — small helper classes that replaced every inline `style` attribute.
6. **Responsive design** — media queries described below.

## Responsive design
| Breakpoint | Query | What adapts |
|---|---|---|
| Tablet | `max-width: 1024px` | Tighter section spacing, smaller product grid columns, 2-column looks gallery, narrower gaps |
| Small tablet | `max-width: 768px` | **Navigation** collapses into a hamburger menu; detail, cart and split layouts become one column; deal cards stack |
| Mobile | `max-width: 600px` | Base font size reduced; product grid becomes 2 columns; category chips scroll horizontally; smaller cart images; forms go single column |

- **Navigation:** full horizontal bar on desktop; hamburger button on ≤ 768px (keyboard accessible, `aria-expanded`, closes on link click or Esc).
- **Images:** fluid (`max-width: 100%; height: auto`), `object-fit: cover`, aspect ratios that change per breakpoint, `loading="lazy"`.
- **Layout:** Grid columns and gaps change at each breakpoint; the order summary stops being sticky on small screens.
- **Typography:** `clamp()` headings scale fluidly; body size, letter-spacing and card text are reduced on mobile.
- Reduced-motion users get no transitions (`prefers-reduced-motion`).

## Feedback from Part 1
| Feedback received | Change made in Part 2 | Where |
|---|---|---|
| [paste lecturer feedback point 1] | [describe the change] | [file / section] |
| [paste lecturer feedback point 2] | [describe the change] | [file / section] |

## Changelog
Format based on Keep a Changelog (Lacan, n.d.).

### [2.1.0] — 2026-09-19
**Added**
- 50 new photos in `/images` (79 in total); every photo is now used on the site.
- Product detail pages show a photo gallery: main image plus clickable thumbnails.
- Home "Looks We Love" gallery now shows all 8 editorial looks.

### [2.0.0] — Part 2 — 2026-09-18
**Added**
- Structured media queries for tablet (≤ 1024px), small tablet (≤ 768px) and mobile (≤ 600px).
- Hamburger navigation menu with JavaScript toggle, `aria-expanded` state, Esc-to-close.
- Interaction styles using pseudo-classes and pseudo-elements (hover, focus, focus-visible, active, disabled, invalid, nth-child, ::before, ::after).
- Default styles section (headings, lists, form controls, selection colour).
- Active-page highlight on the navigation using `aria-current="page"`.
- `prefers-reduced-motion` support.

**Changed**
- Reorganised `style.css` into six commented sections.
- Replaced all inline `style` attributes (HTML and JS-generated) with utility classes.
- Images now use `height: auto` plus per-breakpoint aspect ratios; card images decode asynchronously.
- Replaced the old 820px / 520px media queries with the new breakpoint set.
- Rewrote this README with structure, CSS, responsive and referencing information.

**Fixed**
- Header link styles (`nav a`) never applied because the header used a `<div>`; the link container is now a real `<nav>` element.

### [1.0.0] — Part 1 — [add date]
- Built the nine-page storefront: home, shop, product details, deals, bag, checkout, sign-in, about and contact.
- Added `app.js` product data, cart with localStorage, category filters and form handling.
- Added light and dark colour themes.

## Git workflow
Work is committed in small, descriptive steps using messages such as `Add hamburger menu and toggle script` or `Fix nav selectors by using a real <nav> element`, so the history reads as a record of development.

## Notes and limitations
Front-end prototype only. Cart and account details are kept in browser `localStorage`, which is not secure — no real payments are processed and no card details are stored or sent anywhere.

## References
Google (2026) *Cormorant Garamond*. Google Fonts. Available at: https://fonts.google.com/specimen/Cormorant+Garamond (Accessed: 18 September 2026).

Google (2026) *Jost*. Google Fonts. Available at: https://fonts.google.com/specimen/Jost (Accessed: 18 September 2026).

Lacan, O. (n.d.) *Keep a Changelog*. Available at: https://keepachangelog.com/en/1.1.0/ (Accessed: 18 September 2026).

MDN Web Docs (2026a) *Using media queries*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries (Accessed: 18 September 2026).

MDN Web Docs (2026b) *Pseudo-classes*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes (Accessed: 18 September 2026).

MDN Web Docs (2026c) *object-fit*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit (Accessed: 18 September 2026).

**Images:** [add the source of every photo in `/images` — photographer or website, year, URL, access date]
