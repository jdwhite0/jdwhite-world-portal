// jdwhite.world — Founder-level access list (daily brief). Resend audience + welcome.
// Sends from the VERIFIED domain (jdwhite.world). Env required (Vercel project for jdwhite.world):
//   RESEND_API_KEY, RESEND_FOUNDER_AUDIENCE_ID
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const email = (body && body.email ? String(body.email) : '').trim();
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const AUDIENCE_ID = process.env.RESEND_FOUNDER_AUDIENCE_ID;
  const FROM = 'JD White <hello@jdwhite.world>';
  if (!RESEND_API_KEY) {
    console.error('Subscribe error: RESEND_API_KEY not set');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  let captured = false;
  if (AUDIENCE_ID) {
    try {
      const r = await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, unsubscribed: false })
      });
      captured = r.ok || r.status === 422;
      if (!captured) console.error('Resend add failed:', r.status, await r.text());
    } catch (e) { console.error('Resend add threw:', e); }
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: email, subject: "You're on the Founder Brief", html: welcomeHTML() })
    });
    if (r.ok) captured = true;
    else console.error('Welcome email failed (non-fatal):', r.status, await r.text());
  } catch (e) { console.error('Welcome email threw (non-fatal):', e); }

  if (captured || AUDIENCE_ID) return res.status(200).json({ success: true });
  return res.status(500).json({ error: 'Could not record signup' });
}

function welcomeHTML() {
  const mono = "'Courier New',monospace";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;background:#05060B;font-family:Georgia,'Times New Roman',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#05060B;padding:32px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0A0C14;border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;">
  <tr><td style="padding:40px 36px 8px 36px;">
    <div style="font-family:${mono};font-size:10px;letter-spacing:5px;color:#7C8AA5;text-transform:uppercase;">// The Founder Brief //</div>
    <h1 style="margin:14px 0 16px 0;font-size:28px;line-height:1.25;color:#F4F6FB;font-weight:normal;">You're on the inside.</h1>
    <p style="margin:0 0 14px 0;font-size:16px;line-height:1.8;color:#C8CEDC;">
      This is founder-level access — a daily brief on what I'm building, the thinking behind it, and the moves before they're public. Strategy, systems, and signal. No noise.
    </p>
    <p style="margin:0 0 14px 0;font-size:16px;line-height:1.8;color:#C8CEDC;">
      You'll get the first brief soon. Welcome.
    </p>
    <p style="margin:24px 0 0 0;font-size:16px;color:#F4F6FB;">— JD White</p>
  </td></tr>
  <tr><td style="padding:24px 36px 30px 36px;border-top:1px solid rgba(255,255,255,0.06);">
    <p style="margin:0;font-family:${mono};font-size:10px;color:#5A6478;line-height:1.6;">JD White · <a href="https://jdwhite.world" style="color:#5A6478;">jdwhite.world</a> · You can unsubscribe anytime.</p>
  </td></tr>
</table></td></tr></table></body></html>`;
}
