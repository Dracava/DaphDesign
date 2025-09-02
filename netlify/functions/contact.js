'use strict';

const ALLOWED_ORIGIN = process.env.ORG_DOMAIN || '*';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.TO_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@example.com';

function cors(headers = {}) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    ...headers,
  };
}

function isValidEmail(email) {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors() };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors(), body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    if (!RESEND_API_KEY || !TO_EMAIL) {
      return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: 'Server not configured' }) };
    }

    const payload = JSON.parse(event.body || '{}');

    // Honeypot
    if (payload.website) {
      return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: true }) };
    }

    // Optional reCAPTCHA v2 verification
    if (payload.recaptcha) {
      const secret = process.env.RECAPTCHA_SECRET;
      if (!secret) {
        return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: 'Captcha not configured' }) };
      }
      const verify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: payload.recaptcha }),
      });
      const verifyJson = await verify.json();
      if (!verifyJson.success) {
        return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: 'Captcha failed' }) };
      }
    }

    const fullName = String(payload.fullname || '').trim();
    const email = String(payload.email || '').trim();
    const message = String(payload.message || '').trim();
    const phone = String(payload.phone || '').trim();
    const company = String(payload.company || '').trim();
    const service = String(payload.service || '').trim();

    if (!fullName || !isValidEmail(email) || !message) {
      return { statusCode: 422, headers: cors(), body: JSON.stringify({ error: 'Invalid input' }) };
    }

    const subject = `[DaphDesign] New inquiry${service ? ' — ' + service : ''}`;

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;padding:12px;">
        <h2 style="margin:0 0 8px 0;">New website inquiry</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${service ? `<p><strong>Selected service:</strong> ${service}</p>` : ''}
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;background:#f7f7f7;padding:10px;border-radius:6px;">${message}</pre>
      </div>
    `;

    // Send via Resend REST API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${re_21KYvDqm_M4D6aFnQ5L44Ds8Ds8F4MdV4}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: [email],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { statusCode: 502, headers: cors(), body: JSON.stringify({ error: 'Email send failed', details: errText }) };
    }

    return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: 'Server error' }) };
  }
};
