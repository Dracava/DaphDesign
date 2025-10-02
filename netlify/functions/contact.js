// Netlify Function: Send contact form via Resend API
// Environment variables required:
// - RESEND_API_KEY: Your Resend API key
// - CONTACT_TO_EMAIL: Destination email address (where to receive messages)
// - CONTACT_FROM_EMAIL: Verified sender (e.g., hello@your-domain.com)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Basic CORS headers for browser calls
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async function (event) {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: 'OK' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

    if (!apiKey || !toEmail) {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Server email configuration missing.' }),
      };
    }

    // Parse payload and log minimal diagnostics (no secrets)
    const payload = JSON.parse(event.body || '{}');
    console.log('[contact] Incoming payload keys:', Object.keys(payload));
    const {
      fullname = '',
      company = '',
      email = '',
      phone = '',
      message = '',
      service = '',
    } = payload;

    if (!fullname || !email || !message) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Missing required fields.' }) };
    }
    if (!EMAIL_REGEX.test(email)) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid email format.' }) };
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
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[contact] Resend error:', err);
      return { statusCode: res.status, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message || 'Failed to send email.' }) };
    }

    const data = await res.json();
    console.log('[contact] Email sent, id:', data.id);
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ ok: true, id: data.id || null }) };
  } catch (err) {
    console.error('[contact] Unexpected error:', err && err.message);
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Unexpected server error.' }) };
  }
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


