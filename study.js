// /api/study.js
// Vercel Serverless Function — proxies study-mode chat requests to Groq's
// API so the API key stays on the server and is never exposed to the browser.
//
// Required setup (Vercel dashboard → Project → Settings → Environment Variables):
//   GROQ_API_KEY = <your Groq key>
// Then redeploy.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing GROQ_API_KEY. Add it in Vercel project settings.' });
    return;
  }

  const { system, messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required' });
    return;
  }

  try {
    const groqMessages = [
      ...(system ? [{ role: 'system', content: system }] : []),
      ...messages,
    ];

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: groqMessages,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Groq API error:', groqRes.status, errText);
      res.status(502).json({ error: 'AI provider error' });
      return;
    }

    const data = await groqRes.json();
    const text = data.choices?.[0]?.message?.content || '';

    res.status(200).json({ text });
  } catch (err) {
    console.error('Study API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
