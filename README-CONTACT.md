## Contact form via Cloudflare Worker + Resend

This project is hosted on GitHub Pages (static). The contact form submits to a Cloudflare Worker that sends email via Resend.

### Files
- `cloudflare/wrangler.toml`: Worker config
- `cloudflare/src/worker.js`: Worker source
- Frontend uses `window.CONTACT_ENDPOINT` (see `contact.html` inline script and `assets/js/script.js`).

### Deploy steps
1) Install Wrangler CLI
```bash
npm i -g wrangler
```

2) Authenticate
```bash
wrangler login
```

3) From the `cloudflare/` folder, set secrets
```bash
cd cloudflare
wrangler secret put RESEND_API_KEY
wrangler secret put CONTACT_TO_EMAIL
wrangler secret put CONTACT_FROM_EMAIL   # optional (defaults to onboarding@resend.dev)
# If you want to enforce reCAPTCHA, also set:
wrangler secret put RECAPTCHA_SECRET
```

4) Optional: enforce reCAPTCHA
- Edit `wrangler.toml` and set `RECAPTCHA_REQUIRED = "true"`
- Keep your site key in the page (already present) and set `RECAPTCHA_SECRET` as a secret

5) Publish
```bash
wrangler deploy
```

Wrangler will output a Worker URL like `https://daphdesign-contact.YOUR_SUBDOMAIN.workers.dev/contact`.

6) Point frontend to Worker
- In `contact.html`, set:
```html
<script>
  window.CONTACT_ENDPOINT = 'https://daphdesign-contact.YOUR_SUBDOMAIN.workers.dev/contact';
</script>
```
Or add a Cloudflare Route on your domain (e.g., `https://api.daphdesign.com/contact`) and use that URL instead.

7) Verify in Resend
- Ensure the `CONTACT_FROM_EMAIL` sender domain is verified in Resend
- Submit the form and check logs in Resend dashboard


