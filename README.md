# zen web solutions — marketing site

Static one-page site for **zen web solutions**. No build step, no framework. Drop it on Cloudflare Pages and it works.

## Files

```
zen-site/
├── index.html          ← the page
├── css/styles.css      ← all styles
├── js/main.js          ← all animations (split-words, counter, parallax, etc.)
├── favicon.svg         ← the enso Z mark
├── _headers            ← Cloudflare Pages security + caching headers
└── README.md           ← you are here
```

## Deploy to Cloudflare Pages

### Option A — Direct upload (fastest, no Git)

1. Go to **dash.cloudflare.com** → Workers & Pages → **Create application** → Pages → **Upload assets**.
2. Give the project a name (e.g. `zen-web-solutions`).
3. Drag the **entire `zen-site` folder** into the upload box (or zip it first if drag-drop is finicky).
4. Click **Deploy site**. You'll get a `*.pages.dev` URL within ~30 seconds.

### Option B — Git-connected (auto-deploy on push)

1. Push this folder to a GitHub or GitLab repo.
2. Cloudflare dash → Pages → **Connect to Git** → select the repo.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` (or whatever folder holds `index.html`)
4. Deploy. Every push to the main branch ships automatically.

### Custom domain

In the Cloudflare Pages project → **Custom domains** → **Set up a custom domain** → enter `zenwebsolutions.com` (or whatever you own). Cloudflare will walk you through the DNS records — usually a one-click setup if the domain is already on Cloudflare.

## Before you go live — things to update

These are placeholders in `index.html`:

| What | Where | Currently |
|------|-------|-----------|
| WhatsApp number | `index.html` → `+966 XX XXX XXXX` (appears twice) | placeholder |
| Email | `index.html` → `hello@zenwebsolutions.com` | placeholder, but works as a `mailto:` |
| Instagram / LinkedIn links | footer + contact section | `href="#"` |
| Year in copyright | footer | `2026` |
| Form backend | `js/main.js` → form just shows a success message | not wired to anything |

### Wiring up the contact form

The form currently just clears itself and shows "Sent" — it doesn't actually send anywhere. Two easy options:

**Formspree** (simplest): Sign up at formspree.io, get your endpoint URL, and replace the `<form>` tag in `index.html`:

```html
<form class="contact-form reveal" id="contact-form" action="https://formspree.io/f/YOUR_ID" method="POST">
```

Then in `js/main.js`, remove the `e.preventDefault()` line inside the form submit handler so it actually submits.

**Cloudflare Pages Functions** (more control, free tier is generous): Add a `functions/api/contact.js` file that receives the form POST and forwards it to your email via something like Resend or MailChannels. See the Cloudflare Pages Functions docs.

## Customizing

- **Colors** live as CSS variables at the top of `css/styles.css` (`--sand`, `--moss`, etc.). Change them in one place and the whole site re-skins.
- **Animations** are all in `js/main.js`, numbered 1–10 with comments. Disable any block by commenting it out.
- The site already respects `prefers-reduced-motion` and disables parallax on touch devices automatically.

## Performance notes

- No JavaScript framework, no bundler, no dependencies. Total page weight: ~50KB before fonts.
- Google Fonts are loaded with `preconnect` for fast handshake.
- `_headers` caches CSS/JS for a year (`immutable`). If you edit `styles.css` or `main.js`, rename them (`styles.v2.css`) so browsers fetch fresh — or use Cloudflare's "Purge Cache" button after each deploy.

---

Built single-file, then split — by Claude, for zen web solutions.
