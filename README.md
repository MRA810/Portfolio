# Ashraful Alam — portfolio

React 18 + Vite 8 single-page site (Three.js, Lenis). The build is fully static (`dist/`).

Requires **Node 22.12+** (pinned in `.nvmrc`).

```bash
npm install
npm run dev        # local dev server
npm run build      # production build -> dist/
```

## Deploy on Cloudflare

Both options serve the same `dist/` folder. `public/_headers` (copied into `dist/`)
sets caching and security headers on both.

### Cloudflare Workers (static assets)

Config: `wrangler.jsonc` (assets only, no server code; unknown paths fall back to `index.html`).

- **From your machine:** `npx wrangler login` once, then `npm run deploy`.
- **From Git (Workers Builds):** connect the repo in the dashboard under
  Workers & Pages → Create → Import a repository. Build command `npm run build`,
  deploy command `npx wrangler deploy` (the default).
- Try it locally in the Workers runtime: `npm run cf:dev`.

### Cloudflare Pages

- **From Git:** Workers & Pages → Create → Pages → Connect to Git.
  Framework preset: *None* (or *Vite*). Build command `npm run build`,
  build output directory `dist`. Node version comes from `.nvmrc`.
- **From your machine:** `npx wrangler login` once, then `npm run deploy:pages`
  (creates the `ashraful-portfolio` Pages project on first run).

Pages ignores `wrangler.jsonc` (it has no `pages_build_output_dir`), so the two setups do not conflict.

## Content

- Certificates: `public/Certificates/web/` (web-sized copies only; originals stay outside the project)
- Gallery photos: `public/gallery/<event>/` + the `EVENTS` list in `src/App.jsx`
- Contact icons: `public/icons/`
