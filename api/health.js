export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://www.shoppalacebeauty.com");
  res.setHeader("Vary", "Origin");
  res.status(200).json({ ok: true });
}
