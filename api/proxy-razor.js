// api/proxy-razor.js
// Vercel Serverless Function (Node 18+ with global fetch)
export default async function handler(req, res) {
  try {
    // Allowed affiliate URL(s) — set via Environment Variable (comma separated) in Vercel dashboard.
    const allowed = (process.env.ALLOWED_AFFILIATE_URLS || "").split(",").map(s => s.trim()).filter(Boolean);
    const AFFILIATE = allowed[0] || 'https://www.kayw1hdj.com/2P1WQ3X/FTXWKCR/?sub4=Men\'s%20Razor%20Refill%20Set%20%2B%20Free%20Handle%20%E2%80%93%20Ultra-Sharp%20Stainless%20Blades%20for%20Smooth%20Shave&sub5=https://hcom-prod-us.nyc3.cdn.digitaloceanspaces.com/images/66e3fd7059195b8dbfc68715-1754650006780-8ba7999073e3eae7fffea4bcbcc1ffe7-0.webp&adv2=19.99'; // fallback to value embedded for demo

    if (!AFFILIATE) {
      res.status(500).send("Affiliate URL not configured on server.");
      return;
    }

    const remoteResp = await fetch(AFFILIATE, { redirect: "follow", headers: { "User-Agent": "Shopify-App-Proxy-Demo/1.0" } });
    if (!remoteResp.ok) {
      res.status(502).send("Unable to fetch remote content.");
      return;
    }

    let text = await remoteResp.text();

    // --- Basic sanitization (remove dangerous things)
    function sanitizeHtml(html) {
      html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
      html = html.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");
      html = html.replace(/ on\w+\s*=\s*"(?:[^"]*)"/gi, "");
      html = html.replace(/ on\w+\s*=\s*'(?:[^']*)'/gi, "");
      html = html.replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, 'href="#"');
      return html;
    }

    text = sanitizeHtml(text);

    // --- Rewrite relative URLs into absolute using affiliate origin
    try {
      const remoteUrl = new URL(AFFILIATE);
      const origin = remoteUrl.origin;
      text = text.replace(/(src|href)\s*=\s*"(?!https?:|data:|\/\/)([^"]*)"/gi, (m, attr, url) => {
        if (!url || url.startsWith("#")) return `${attr}="${url}"`;
        const absolute = new URL(url, origin).href;
        return `${attr}="${absolute}"`;
      });
      text = text.replace(/(src|href)\s*=\s*'(?!https?:|data:|\/\/)([^']*)'/gi, (m, attr, url) => {
        if (!url || url.startsWith("#")) return `${attr}='${url}'`;
        const absolute = new URL(url, origin).href;
        return `${attr}='${absolute}'`;
      });
    } catch (e) {
      console.error("rewrite error", e);
    }

    const snippet = `
      <div class="proxied-affiliate-offer">
        <style>
          .proxied-affiliate-offer { font-family: system-ui, Arial, sans-serif; line-height:1.4; }
          .proxied-affiliate-offer img { max-width:100%; height:auto; display:block; }
        </style>
        <div><strong>Offer (proxied, sanitized)</strong></div>
        <div>${text}</div>
      </div>
    `;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=59");

    res.status(200).send(snippet);
  } catch (err) {
    console.error("proxy error:", err);
    res.status(500).send("Proxy server error.");
  }
}
