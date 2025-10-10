export default {
  async fetch(request, env, ctx) {
    const { method } = request;
    const url = new URL(request.url);

    // Handle contact form submissions
    if (url.pathname === '/contact') {
      return handleContactForm(request, env);
    }

    // Handle clean URLs (remove .html extensions)
    if (url.pathname.endsWith('.html')) {
      const cleanPath = url.pathname.replace('.html', '');
      return Response.redirect(new URL(cleanPath + url.search, url.origin), 301);
    }

    // Serve HTML files for clean URLs
    const cleanPaths = {
      '/': '/index.html',
      '/about': '/about.html',
      '/contact': '/contact.html',
      '/portfolio': '/portfolio.html',
      '/resume': '/resume.html',
      '/projects/animalrights': '/projects/animalrights.html',
      '/projects/budgeting': '/projects/budgeting.html',
      '/projects/delftmapper': '/projects/delftmapper.html',
      '/projects/feedbackplatform': '/projects/feedbackplatform.html',
      '/projects/promptlyux': '/projects/promptlyux.html',
      '/projects/studentsofux': '/projects/studentsofux.html',
      '/projects/swimming': '/projects/swimming.html'
    };

    const htmlFile = cleanPaths[url.pathname];
    if (htmlFile) {
      // Fetch the HTML file from your origin server
      const originResponse = await fetch(new URL(htmlFile, url.origin));
      if (originResponse.ok) {
        return new Response(originResponse.body, {
          status: originResponse.status,
          statusText: originResponse.statusText,
          headers: {
            ...originResponse.headers,
            'Content-Type': 'text/html'
          }
        });
      }
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleContactForm(request, env) {
    const { method } = request;

    if (method === 'OPTIONS') {
      return corsResponse(null, env);
    }

    if (method !== 'POST') {
      return corsResponse(json({ error: 'Method Not Allowed' }, 405), env);
    }

    try {
      const body = await request.json().catch(() => ({}));
      const {
        fullname = '',
        company = '',
        email = '',
        phone = '',
        message = '',
        service = '',
        recaptcha = '',
        website = '' // honeypot
      } = body || {};

      if (website && website.trim() !== '') {
        return corsResponse(json({ error: 'Spam detected' }, 400), env);
      }

      if (!fullname || !email || !message) {
        return corsResponse(json({ error: 'Missing required fields.' }, 400), env);
      }
      const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!EMAIL_REGEX.test(email)) {
        return corsResponse(json({ error: 'Invalid email format.' }, 400), env);
      }

      const recaptchaRequired = (env.RECAPTCHA_REQUIRED || 'false').toLowerCase() === 'true';
      if (recaptchaRequired) {
        const secret = env.RECAPTCHA_SECRET;
        if (!secret) {
          return corsResponse(json({ error: 'Server misconfigured: RECAPTCHA_SECRET missing.' }, 500), env);
        }
        if (!recaptcha) {
          return corsResponse(json({ error: 'Please complete the reCAPTCHA.' }, 400), env);
        }
        const verify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ secret, response: recaptcha })
        });
        const verifyData = await verify.json().catch(() => ({}));
        if (!verify.ok || !verifyData.success) {
          return corsResponse(json({ error: 'reCAPTCHA verification failed.' }, 400), env);
        }
      }

      const apiKey = env.RESEND_API_KEY;
      const toEmail = env.CONTACT_TO_EMAIL;
      const fromEmail = env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
      if (!apiKey || !toEmail) {
        return corsResponse(json({ error: 'Server email configuration missing.' }, 500), env);
      }

      const subject = `New contact form submission — ${fullname}${service ? ` (${service})` : ''}`;
      const html = `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#222">
          <h2 style="margin:0 0 8px 0">New message from DaphDesign</h2>
          <p><strong>Name:</strong> ${escapeHtml(fullname)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ''}
          ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
          ${service ? `<p><strong>Service:</strong> ${escapeHtml(service)}</p>` : ''}
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
        </div>
      `;

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: fromEmail, to: [toEmail], subject, html })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return corsResponse(json({ error: err.message || 'Failed to send email.' }, res.status), env);
      }

      const data = await res.json().catch(() => ({}));
      return corsResponse(json({ ok: true, id: data.id || null }, 200), env);
    } catch (err) {
      return corsResponse(json({ error: 'Unexpected server error.' }, 500), env);
    }
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}

function corsResponse(response, env) {
  const origin = '*';
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (!response) {
    return new Response(null, { status: 204, headers });
  }
  const merged = new Headers(response.headers);
  Object.entries(headers).forEach(([k, v]) => merged.set(k, v));
  return new Response(response.body, { status: response.status, headers: merged });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


