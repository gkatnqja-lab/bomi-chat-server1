export default async function handler(req, res) {
  const origin = req.headers.origin;

  // CORS: 네 도메인만 허용
  if (origin === "https://www.shoppalacebeauty.com" || origin === "https://shoppalacebeauty.com") {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing message" });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing ANTHROPIC_API_KEY" });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 300,
        temperature: 0.4,
        messages: [{ role: "user", content: message.slice(0, 2000) }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: "Claude API error", details: data });
    }

    return res.status(200).json({ reply: data?.content?.[0]?.text || "" });
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: String(e) });
  }
}
