# WEDE5020 Part 2 — Rubric Alignment Checklist

**Student:** ST10533111 — JODY'LEE GUMEDE  
**Project:** Lumière Beauty  
**Updated:** 2 November 2026

This checklist maps the final website files to the marking rubric. GitHub history, lecturer-feedback evidence and the final deployed URL remain external evidence that cannot be proven by an offline ZIP alone.

| Rubric area | Final evidence |
|---|---|
| Interactive elements | Responsive navigation, product cards, cart quantity controls, wishlist, search/filtering, product thumbnails, account forms, reviews, admin controls, checkout and tracking actions in `app.js` |
| Interactive map | `tracking.html` updates a Google Maps embed from the saved delivery address; `contact.html` also includes a studio/dispatch-area map |
| Gallery lightbox | `gallery.html` and the home lookbook open images in a keyboard-accessible `<dialog>` lightbox |
| Dynamic content/search | Product search and category filtering, dynamic product detail data, Product Hub/New Products rendering, wishlist, reviews, account history, admin orders and tracking status |
| SEO title tags | Unique descriptive `<title>` on all 27 HTML pages |
| Meta keywords | Page-specific keywords on all 27 HTML pages |
| Meta descriptions | Page-specific descriptions on all 27 HTML pages |
| Image filenames/alt text | Descriptive local filenames and non-empty alt text verified across 114 HTML image uses |
| Enquiry controls | `enquiry.html` contains text, email, dropdown, reference field, textarea, radio buttons, phone field and consent checkbox |
| Enquiry validation | Required/minlength/email/tel/pattern constraints plus browser validation and visible feedback |
| Enquiry process/response | Enquiries are stored locally, receive an immediate reference response, and are marked for Netlify Forms submission when deployed |
| Contact controls | `contact.html` includes labelled controls, support information, preferred reply radio controls, optional order number and consent checkbox |
| Contact validation | Native constraints plus user-friendly validation messages in `app.js` |
| Contact process | Successful local submission is stored and acknowledged; deployed form is Netlify-ready for server-side capture |
| Product/cart functionality | Add to bag, wishlist, deal bundles, quantity +/−, remove, subtotal, delivery fee, discount code and checkout |
| Login/sign-up | Registration, duplicate-email checks, password confirmation, local password hash comparison, remember-me session and logout |
| Forgot password | `forgot-password.html` updates the password hash for a browser-local demo account |
| Account dashboard | `account.html` displays profile details, order count, wishlist count, order history and notifications |
| Wishlist | `wishlist.html` stores favourites and supports remove/add-to-bag actions |
| Reviews | `reviews.html` validates and renders customer reviews dynamically |
| Payment methods | `payment-methods.html` saves a preferred demo method and checkout reads that preference |
| Order confirmation | `order-confirmation.html` displays purchased items, delivery details, total, tracking link and Print/Save-PDF support |
| Delivery tracking | Unique `LB-########` IDs, five stages, ETA, address details, notifications, map and demo status progression |
| Admin functionality | `admin.html` displays local order/user/enquiry/review counts and changes order delivery status |
| Responsive design | Desktop/tablet/mobile breakpoints, responsive navigation, gallery, account, tracking, receipt and admin layouts |
| Accessibility | Labels, focus-visible states, keyboard lightbox, status regions, reduced-motion support and semantic controls |
| README/documentation | `README.md`, `START-HERE.txt`, `SETUP-ACCOUNTS.md`, `SUBMISSION-STEPS.txt`, `README-NETLIFY.txt`, `CHANGELOG.md` and test documents |
| References | `references.html`, `REFERENCES.md` and `IMAGE-SOURCES.md` |
| GitHub descriptive commits | **External action required:** push the project with multiple meaningful commits |
| Lecturer feedback changes | **External evidence required:** document the actual Part 1 feedback supplied by the lecturer; none was provided in the files used for this update |
| Website deployment | **External action required:** deploy to Netlify and submit the live URL/repository URL |

## Automated checks completed

- `app.js` passes `node --check`.
- 27 HTML pages checked for titles, meta descriptions, keywords, duplicate IDs, local targets, image alt text and student ID comments.
- 114 HTML image uses checked; no missing alt text.
- 12 forms detected; Contact and Enquiry verified as Netlify-enabled.
- Browser DOM interaction harness passed 15 functional flows with zero JavaScript page errors.

## Suggested Git commits

Use several real commits, for example: `Add account and password reset flows`, `Add wishlist reviews and enquiry apps`, `Add order confirmation and PDF-ready receipt`, `Add delivery map tracking and admin controls`, `Add gallery and glam responsive styling`, and `Update rubric documentation and Netlify forms`.
