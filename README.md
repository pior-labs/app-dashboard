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
