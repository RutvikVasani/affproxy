VERCEL PROXY (ready-to-deploy)
Shopify domain: northrepublic-2.myshopify.com
Proxy subpath: razor
Affiliate URL (for demo): https://www.kayw1hdj.com/2P1WQ3X/FTXWKCR/?sub4=Men's%20Razor%20Refill%20Set%20%2B%20Free%20Handle%20%E2%80%93%20Ultra-Sharp%20Stainless%20Blades%20for%20Smooth%20Shave&sub5=https://hcom-prod-us.nyc3.cdn.digitaloceanspaces.com/images/66e3fd7059195b8dbfc68715-1754650006780-8ba7999073e3eae7fffea4bcbcc1ffe7-0.webp&adv2=19.99

Contents:
- api/proxy-razor.js   (Vercel serverless function)
- package.json
- vercel.json

WHAT I DID:
I prepared a Vercel project you can deploy. The function fetches the affiliate URL server-side,
sanitizes it (removes scripts/iframes/inline handlers), rewrites relative URLs to absolute,
and returns a safe HTML snippet that Shopify will serve under:
https://northrepublic-2.myshopify.com/apps/affiliate-proxy/razor

DEPLOY STEPS (non-coder friendly):
1) Create a free GitHub account (if you don't have one).
2) Create a new repository on GitHub (Private or Public).
3) Upload the files from this project into the repo using GitHub's web UI (drag-and-drop).
   - Files: api/proxy-razor.js, package.json, vercel.json, README.md
4) Go to https://vercel.com and sign up / login with GitHub.
5) Click "New Project" → Import Git Repository → choose the repo you just created.
6) In Vercel project settings, add Environment Variable:
   - Key: ALLOWED_AFFILIATE_URLS
   - Value: https://www.kayw1hdj.com/2P1WQ3X/FTXWKCR/?sub4=Men's%20Razor%20Refill%20Set%20%2B%20Free%20Handle%20%E2%80%93%20Ultra-Sharp%20Stainless%20Blades%20for%20Smooth%20Shave&sub5=https://hcom-prod-us.nyc3.cdn.digitaloceanspaces.com/images/66e3fd7059195b8dbfc68715-1754650006780-8ba7999073e3eae7fffea4bcbcc1ffe7-0.webp&adv2=19.99
7) Deploy the project (click "Deploy").
8) After deployment, note the deployment URL (e.g. https://vercel-proxy-yourname.vercel.app).
   The proxy endpoint will be:
   https://<your-deploy-url>/api/proxy/razor

SHOPIFY APP PROXY:
1) In Shopify Admin (northrepublic-2.myshopify.com) → Apps → Develop apps → Create app (if needed).
2) In the app's App Proxy settings, configure:
   - Proxy URL prefix: /apps/affiliate-proxy
   - Subpath: razor
   - Forwarding address: https://<your-deploy-url>/api/proxy/razor
   - Method: GET
3) Save and install the app.
4) Add this snippet to a Shopify Page (HTML view) to render proxied content:
   <div id="proxied-offer">Loading offer…</div>
   <script>
     fetch('/apps/affiliate-proxy/razor', { credentials:'same-origin' })
       .then(r=>r.text()).then(html=>document.getElementById('proxied-offer').innerHTML=html)
       .catch(e=>document.getElementById('proxied-offer').innerText='Offer unavailable.');
   </script>

IMPORTANT NOTES:
- This demo is educational. Do NOT use it to hide destinations from ad platforms.
- Check affiliate T&Cs. If the network forbids reproducing landing pages, extract only images/text you have rights to and write your own copy.
- The provided sanitizer is basic; for production use a library like 'sanitize-html'.

If you'd like, I can also produce a ZIP of this project ready to upload. -> I have generated it for you; download below.
