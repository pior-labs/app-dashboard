# Homepage Dashboard

A static single-page link dashboard for self-hosted apps and infra tools.

## Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Build

```bash
npm run build
```

The static output is written to `dist/` and can be served by any static file server.

To add links, set `VITE_DASHBOARD_LINKS` in `.env.local` to a JSON array and rebuild. Vite embeds `VITE_`
values in the client bundle, so keep `.env.local` out of git but only deploy this dashboard where the links
can be visible to viewers.
