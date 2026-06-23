# zen web solutions — marketing site

Static one-page site for **zen web solutions**. No build step, no framework. Drop it on Cloudflare Pages and it works.

## 🚨 If you re-deploy and animations look broken

You're almost certainly seeing **cached old CSS/JS** in your browser.

Fix in order:
1. **Hard refresh** the page: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac).
2. If that doesn't work, **open in an Incognito / Private window** — bypasses cache entirely.
3. Last resort: in the Cloudflare dashboard → your Pages project → **Caching** → **Purge Everything**.

This site's `_headers` caches CSS/JS for 1 hour. If you're iterating frequently, the easiest workflow is to keep dev tools open with "Disable cache" checked (Network tab in Chrome/Firefox).

## Files

```
zen-site/
├── index.html          ← the page
├── css/styles.css      ← all styles
├── js/main.js          ← all animations + form submission
├── favicon.svg         ← the enso Z mark
├── _headers            ← Cloudflare Pages security + caching headers
└── README.md           ← you are here
```

## ⚠ Two things to set up BEFORE deploying

### 1. Wire up the contact form (5 minutes, free)

The form is built to submit to **Web3Forms** — a free service that emails you every submission and stores them in a dashboard. No backend code, no signup with a credit card.

1. Go to **https://web3forms.com**.
2. Enter `info@xotic.dev` in the "Get Access Key" box. They'll email you an access key (a UUID).
3. Open `index.html`, find this line:
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY_HERE">
   ```
4. Replace `YOUR_WEB3FORMS_ACCESS_KEY_HERE` with the key from the email.
5. Save. Done. Every form submission now lands in `info@xotic.dev`.

**Free tier:** 250 submissions/month, unlimited forms, spam filtering. If the form is not configured, it tells the user to email you directly instead.

### 2. Update the year + Instagram link

- Copyright year (`© 2026`) — search `2026` in `index.html`
- Instagram link in the footer is `href="#"` — point it at your real account or remove the `<li>`

## Deploy to Cloudflare Pages

### Option A — Direct upload (fastest, no Git)

1. Go to **dash.cloudflare.com** → Workers & Pages → **Create application** → Pages → **Upload assets**.
2. Name the project (e.g. `zen-web-solutions`).
3. Drag the **entire `zen-site` folder** into the upload area.
4. Click **Deploy site**. You get a `*.pages.dev` URL within ~30 seconds.

### Option B — Git-connected (auto-deploy on push)

1. Push this folder to GitHub or GitLab.
2. Cloudflare dash → Pages → **Connect to Git** → select the repo.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
4. Deploy. Every push to main re-deploys.

### Custom domain

Pages project → **Custom domains** → **Set up a custom domain** → enter `zenwebsolutions.com` (or whatever you own). Cloudflare walks you through the DNS — one-click if the domain is already on Cloudflare.

## What's on the page

- **Page-load curtain** with the enso brush logo drawing in
- **Hero** with line-mask reveal animation on the headline
- **Top ticker** scrolling the value props
- **Stats band** with counters ($0 upfront, $999 → $99 count-down, 14 days, 100%)
- **What's Included** — 6 cards with 3D tilt-on-hover
- **How It Works** — 4-step process with scroll-driven progress bar
- **Pricing card** with the $999 → $99 count-down
- **Contact form** wired to Web3Forms
- **Footer** with letter-by-letter "Let's build." spring reveal

## Customizing

- **Colors** are CSS variables at the top of `css/styles.css` (`--sand`, `--moss`, etc.). Change once, the whole site re-skins.
- **Animations** live in `js/main.js`, each numbered 1–12 with a comment header. Disable any block by commenting it out.
- `prefers-reduced-motion` is respected — parallax, 3D tilt, and the curtain all back off automatically.

## Performance

- No framework, no bundler. Page weight ~60KB before fonts.
- `_headers` caches CSS/JS for a year (`immutable`). If you edit `styles.css` or `main.js`, either rename the file (`styles.v2.css`) so browsers re-fetch, or hit Cloudflare's "Purge Cache" after deploy.

## Form backend alternatives

If Web3Forms doesn't fit:

- **Formspree** (formspree.io) — similar service. Swap the `<form action>` URL.
- **Cloudflare Pages Functions** — write `functions/api/contact.js` that handles the POST and forwards via Resend. Most flexibility, requires code. See Cloudflare's Pages Functions docs.
- **Netlify Forms** — only if you move to Netlify; add the `netlify` attribute to the `<form>` tag.

---

Built single-file, then split — by Claude, for zen web solutions.
