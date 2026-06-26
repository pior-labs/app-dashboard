# Homepage Dashboard

A static single-page link dashboard for self-hosted apps and infra tools.

## Development

```bash
npm install
cp public/links.example.json public/links.json
npm run dev
```

## Build

```bash
npm run build
```

The static output is written to `dist/` and can be served by any static file server.

To add links, edit `public/links.json`. That file is ignored by git; `public/links.example.json` is the safe
committed template. Anyone who can load the deployed dashboard can also read `/links.json`, so only deploy it
where those links can be visible to viewers.

## Deployment

Pushes to `main` rebuild the static files with GitHub Actions and sync `dist/` to the Caddy web root over SSH.
The sync preserves `links.json` on the server, so keep the production copy at the root Caddy serves.

Required repository secrets:

- `DASHBOARD_DEPLOY_HOST`
- `DASHBOARD_DEPLOY_USER`
- `DASHBOARD_DEPLOY_KEY`
- `DASHBOARD_DEPLOY_PATH`
- `DASHBOARD_DEPLOY_PORT` optional, defaults to `22`
