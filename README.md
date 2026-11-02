# Lumière Beauty — Makeup Store

**Module:** WEDE5020 — Web Development (Introduction) · **Assessment:** Part 2 · The IIE
**Student name / number:** ST10533111 — JODY'LEE GUMEDE
**Live site:** Not yet supplied · **Repository:** Not yet supplied

## Overview
Lumière Beauty is a multi-page, front-end makeup store prototype. It has a product catalogue with category filters, product detail pages, deals, a shopping bag, checkout, sign-in / sign-up, delivery tracking with a map, and About and Contact pages. The design is responsive from desktop down to small phones and supports light and dark mode.

## Pages
| Page | Purpose |
|---|---|
| `index.html` | Home: hero, categories, bestsellers, looks gallery, reviews |
| `products.html` | Full catalogue with category filters (`?cat=Lips` also works) |
| `product-details.html` | Dynamic product view (`?id=0` … `?id=65`) |
| `deals.html` | Bundles with discount code `LUMIERE10` |
| `cart.html` | Bag with quantity controls and delivery rules |
| `checkout.html` | Delivery and payment form with live order summary |
| `login.html` | Sign in / sign up and order-history dashboard |
| `tracking.html` | Order lookup, five delivery stages and destination map |
| `about.html`, `contact.html` | Brand story and contact form |

## Project structure
```
site/
├── index.html … tracking.html  10 pages, each linked to style.css
├── style.css                   external stylesheet (all styling)
├── products-data.js            shared catalogue data
├── app.js                      cart, account, checkout, filters, forms and tracking
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

- **Navigation:** full horizontal bar on desktop; CSS checkbox hamburger menu on ≤ 768px, with visible focus states and keyboard-accessible links.
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

### [1.0.0] — Part 1 — initial submission (date not provided)
- Built the nine-page storefront: home, shop, product details, deals, bag, checkout, sign-in, about and contact.
- Added `app.js` product data, cart with localStorage, category filters and form handling.
- Added light and dark colour themes.

## Git workflow
Work is committed in small, descriptive steps using messages such as `Add hamburger menu and toggle script` or `Fix nav selectors by using a real <nav> element`, so the history reads as a record of development.

## Notes and limitations
Front-end prototype only. Cart, account and order details are kept in browser storage. Demo passwords are compared using a small local hash, but this is not production security. No real payments are processed and no card or banking details are requested or sent anywhere.

## References
Google (2026) *Cormorant Garamond*. Google Fonts. Available at: https://fonts.google.com/specimen/Cormorant+Garamond (Accessed: 18 September 2026).

Google (2026) *Jost*. Google Fonts. Available at: https://fonts.google.com/specimen/Jost (Accessed: 18 September 2026).

Google (2026) *Google Maps*. Available at: https://maps.google.com/ (Accessed: 2 November 2026).

Lacan, O. (n.d.) *Keep a Changelog*. Available at: https://keepachangelog.com/en/1.1.0/ (Accessed: 18 September 2026).

MDN Web Docs (2026a) *Using media queries*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries (Accessed: 18 September 2026).

MDN Web Docs (2026b) *Pseudo-classes*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes (Accessed: 18 September 2026).

MDN Web Docs (2026c) *object-fit*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit (Accessed: 18 September 2026).

**Images:** The final update uses the local image assets supplied with the original student project. See `IMAGE-SOURCES.md` for the asset-source note and verify original ownership/attribution before public publication.


## Part 2 rubric implementation and limitations (November 2026)
- Implemented: working `app.js`, bag quantity controls and totals, catalogue search, category URL filtering, product thumbnail switching, interactive gallery lightbox, contact-form validation and visible feedback, demo checkout, SEO description and keywords, accessible focus states, lazy-loading images, and comments.
- Accounts are browser-only demos; **no secure server authentication** exists. Passwords are locally hashed and verified for the prototype, but browser storage is not secure. Orders persist in the current browser and **no payments, emails or real courier updates are sent**.
- GitHub commit history, deployment and live URL must be completed by the student on their own accounts. They cannot be verified from an offline ZIP.
- Check original image rights and credits before publishing. Contact information is illustrative.
- For full production functionality, use a backend service with secure authentication, order management, mail delivery and a PCI-compliant hosted payment provider.

## Testing checklist
1. Open `index.html`, click a bestseller's Add to bag button, check the Bag count.
2. Visit `cart.html`, adjust quantities, remove products, verify totals and shipping.
3. Visit `products.html`, search and try `products.html?cat=Lips`.
4. Click a lookbook image on Home, then close with Escape.
5. Try empty and valid contact form submissions; feedback should appear.
6. Create an account, sign in, add a product, submit checkout, then use the generated `LB-########` number on `tracking.html`.
7. On tracking, use **Demo: advance status** to test every delivery stage and confirm the destination map loads.
8. Check responsive layouts on phone/tablet/desktop and verify images in browser developer tools.
9. Commit your changes to GitHub in multiple meaningful commits and deploy the site, then add real URLs above.


## Enhanced account and delivery features
- Sign-up and sign-in with validation and local browser persistence.
- Signed-in account dashboard with order history.
- Checkout creates a unique `LB-########` demo order and stores delivery details.
- `tracking.html` searches by order number, shows five delivery stages, and embeds a destination map.
- A demo status-advance control lets an assessor test the complete tracking flow without a courier backend.
- Navigation updates the Account label when a user is signed in.
- Glam styling adds glass effects, gradients, motion, hover polish, responsive tracking cards, and accessibility-friendly reduced-motion behaviour.

> Important: this is a static academic prototype. Authentication, payment and courier tracking use browser storage and are not production security or real logistics services.


## Full application/page suite added on 2 November 2026

The project now includes the requested application pages: Account, Admin Demo, Cart, Checkout, Contact, Deals, Enquiry, Forgot Password, Gallery, Login, Netlify Forms, Order Confirmation, Payment Methods, Product Hub, Product Details, New Products, Register, Reviews, References, Terms, Track Order/Delivery and Wishlist.

Connected browser-local functions include registration/login/logout, password reset, cart quantities, wishlist, checkout, order history, printable PDF-ready receipt, delivery status management, interactive maps, reviews, contact/enquiry storage, search/filtering and gallery lightbox. Contact and enquiry forms are also marked for Netlify Forms detection on deployment.

### Important prototype limitation
Authentication, orders, reviews, wishlist and delivery states are stored in browser `localStorage` / `sessionStorage`. They are suitable for the WEDE5020 academic demonstration but are not a production backend. Do not use real passwords or payment credentials.
